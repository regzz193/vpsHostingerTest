<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    /**
     * Display a listing of the skills.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $skills = Skill::orderBy('category')
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $skills]);
    }

    /**
     * Display a listing of the skills grouped by category.
     *
     * @return \Illuminate\Http\Response
     */
    public function grouped()
    {
        $grouped = Skill::getAllGroupedByCategory();

        return response()->json(['data' => $grouped]);
    }

    /**
     * Store a newly created skill in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:frontend,backend,devops',
            'order' => 'nullable|integer',
            'proficiency' => 'nullable|integer|min:1|max:100',
            'to_study' => 'nullable|boolean',
            'study_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // If order is not provided, put it at the end of the category
        if (!$request->has('order')) {
            $maxOrder = Skill::where('category', $request->category)
                ->max('order');
            $request->merge(['order' => $maxOrder ? $maxOrder + 1 : 1]);
        }

        $skill = Skill::create($request->all());

        return response()->json(['message' => 'Skill created successfully', 'data' => $skill], 201);
    }

    /**
     * Display the specified skill.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $skill = Skill::findOrFail($id);

        return response()->json(['data' => $skill]);
    }

    /**
     * Update the specified skill in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|in:frontend,backend,devops',
            'order' => 'sometimes|required|integer',
            'proficiency' => 'sometimes|required|integer|min:1|max:100',
            'to_study' => 'sometimes|boolean',
            'study_notes' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = Skill::findOrFail($id);
        $skill->update($request->all());

        return response()->json(['message' => 'Skill updated successfully', 'data' => $skill]);
    }

    /**
     * Remove the specified skill from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->delete();

        return response()->json(['message' => 'Skill deleted successfully']);
    }

    /**
     * Reorder skills within a category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->skills as $item) {
            Skill::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Skills reordered successfully']);
    }

    /**
     * Get skills marked for study.
     *
     * @return \Illuminate\Http\Response
     */
    public function getStudyList()
    {
        $studyList = Skill::where('to_study', true)
            ->orderBy('category')
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $studyList]);
    }

    /**
     * Toggle the to_study status of a skill.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleStudyStatus($id)
    {
        $skill = Skill::findOrFail($id);
        $skill->to_study = !$skill->to_study;
        $skill->save();

        return response()->json([
            'message' => $skill->to_study ? 'Skill added to study list' : 'Skill removed from study list',
            'data' => $skill
        ]);
    }

    /**
     * Update study notes for a skill.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStudyNotes(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'study_notes' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = Skill::findOrFail($id);
        $skill->study_notes = $request->study_notes;
        $skill->save();

        return response()->json([
            'message' => 'Study notes updated successfully',
            'data' => $skill
        ]);
    }
}
