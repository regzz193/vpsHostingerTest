<?php

namespace App\Http\Controllers;

use App\Models\FeaturedProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeaturedProjectController extends Controller
{
    /**
     * Display a listing of the featured projects.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $projects = FeaturedProject::orderBy('order')->get();
        return response()->json(['data' => $projects]);
    }

    /**
     * Store a newly created featured project in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|string|max:255',
            'project_url' => 'nullable|string|max:255',
            'github_url' => 'nullable|string|max:255',
            'technologies' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = FeaturedProject::create($request->all());
        return response()->json(['data' => $project, 'message' => 'Project created successfully'], 201);
    }

    /**
     * Display the specified featured project.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $project = FeaturedProject::findOrFail($id);
        return response()->json(['data' => $project]);
    }

    /**
     * Update the specified featured project in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image_url' => 'nullable|string|max:255',
            'project_url' => 'nullable|string|max:255',
            'github_url' => 'nullable|string|max:255',
            'technologies' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = FeaturedProject::findOrFail($id);
        $project->update($request->all());

        return response()->json(['data' => $project, 'message' => 'Project updated successfully']);
    }

    /**
     * Remove the specified featured project from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $project = FeaturedProject::findOrFail($id);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * Reorder featured projects.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:featured_projects,id',
            'projects.*.order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->projects as $projectData) {
            $project = FeaturedProject::findOrFail($projectData['id']);
            $project->update(['order' => $projectData['order']]);
        }

        return response()->json(['message' => 'Projects reordered successfully']);
    }
}
