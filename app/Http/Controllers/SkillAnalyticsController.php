<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SkillAnalyticsController extends Controller
{
    /**
     * Get skill analytics data for visualization.
     *
     * @return \Illuminate\Http\Response
     */
    public function getAnalytics()
    {
        // Get skills by category
        $skillsByCategory = Skill::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get();

        // Get total skills count
        $totalSkills = Skill::count();

        // Calculate percentages for each category
        $skillsByCategory = $skillsByCategory->map(function ($item) use ($totalSkills) {
            $item->percentage = round(($item->count / $totalSkills) * 100, 1);
            return $item;
        });

        // Get skills distribution
        $skillsDistribution = [
            'labels' => $skillsByCategory->pluck('category')->toArray(),
            'counts' => $skillsByCategory->pluck('count')->toArray(),
            'percentages' => $skillsByCategory->pluck('percentage')->toArray(),
        ];

        // Get top 5 skills (assuming they're ordered by importance)
        $topSkills = Skill::orderBy('order')
            ->take(5)
            ->get(['name', 'category']);

        // Determine if skill set indicates senior level
        $seniorLevelAnalysis = $this->analyzeSeniorLevel();

        return response()->json([
            'total_skills' => $totalSkills,
            'skills_distribution' => $skillsDistribution,
            'top_skills' => $topSkills,
            'senior_level_analysis' => $seniorLevelAnalysis
        ]);
    }

    /**
     * Analyze if skill set indicates senior developer level.
     *
     * @return array
     */
    private function analyzeSeniorLevel()
    {
        // Count skills by category
        $frontendCount = Skill::where('category', 'frontend')->count();
        $backendCount = Skill::where('category', 'backend')->count();
        $devopsCount = Skill::where('category', 'devops')->count();

        // Define thresholds for senior level
        $frontendThreshold = 5;
        $backendThreshold = 5;
        $devopsThreshold = 3;

        // Calculate scores
        $frontendScore = min(100, ($frontendCount / $frontendThreshold) * 100);
        $backendScore = min(100, ($backendCount / $backendThreshold) * 100);
        $devopsScore = min(100, ($devopsCount / $devopsThreshold) * 100);

        // Calculate overall score (weighted average)
        $overallScore = ($frontendScore * 0.35) + ($backendScore * 0.35) + ($devopsScore * 0.3);

        // Determine level based on overall score
        $level = 'Junior';
        if ($overallScore >= 85) {
            $level = 'Senior';
        } elseif ($overallScore >= 60) {
            $level = 'Mid-level';
        }

        return [
            'scores' => [
                'frontend' => round($frontendScore),
                'backend' => round($backendScore),
                'devops' => round($devopsScore),
                'overall' => round($overallScore)
            ],
            'level' => $level,
            'analysis' => $this->getSeniorLevelAnalysisText($level, $frontendScore, $backendScore, $devopsScore)
        ];
    }

    /**
     * Get analysis text based on scores.
     *
     * @param string $level
     * @param float $frontendScore
     * @param float $backendScore
     * @param float $devopsScore
     * @return string
     */
    private function getSeniorLevelAnalysisText($level, $frontendScore, $backendScore, $devopsScore)
    {
        $weakestArea = 'balanced skill set';
        $lowestScore = min($frontendScore, $backendScore, $devopsScore);

        if ($lowestScore == $frontendScore) {
            $weakestArea = 'frontend development';
        } elseif ($lowestScore == $backendScore) {
            $weakestArea = 'backend development';
        } elseif ($lowestScore == $devopsScore) {
            $weakestArea = 'DevOps';
        }

        if ($level == 'Senior') {
            return "Your skill set indicates senior developer proficiency. You have a strong balance of frontend, backend, and DevOps skills.";
        } elseif ($level == 'Mid-level') {
            return "Your skill set indicates mid-level developer proficiency. To reach senior level, consider strengthening your skills in $weakestArea.";
        } else {
            return "Your skill set indicates junior developer proficiency. To advance, focus on building more skills across all areas, particularly in $weakestArea.";
        }
    }
}
