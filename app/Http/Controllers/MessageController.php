<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Store a newly created message in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sender' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = Message::create([
            'sender' => $request->sender,
            'email' => $request->email,
            'subject' => $request->subject,
            'content' => $request->content,
            'read' => false,
        ]);

        return response()->json(['message' => 'Message sent successfully', 'data' => $message], 201);
    }

    /**
     * Display a listing of the messages.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $messages = Message::orderBy('created_at', 'desc')->get();

        return response()->json(['data' => $messages]);
    }

    /**
     * Mark a message as read.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function markAsRead($id)
    {
        $message = Message::findOrFail($id);
        $message->read = true;
        $message->save();

        return response()->json(['message' => 'Message marked as read', 'data' => $message]);
    }

    /**
     * Toggle the read status of a message.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleReadStatus($id)
    {
        $message = Message::findOrFail($id);
        $message->read = !$message->read;
        $message->save();

        $status = $message->read ? 'read' : 'unread';
        return response()->json(['message' => "Message marked as {$status}", 'data' => $message]);
    }

    /**
     * Mark all messages as read.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAllAsRead()
    {
        Message::where('read', false)->update(['read' => true]);

        return response()->json(['message' => 'All messages marked as read']);
    }

    /**
     * Remove the specified message from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }
}
