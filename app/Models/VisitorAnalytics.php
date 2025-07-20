<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorAnalytics extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ip_address',
        'user_agent',
        'page_visited',
        'visit_date',
        'visit_time',
        'country',
        'city',
        'referrer',
        'device_type'
    ];

    /**
     * Get the formatted date for the visit.
     *
     * @return string
     */
    public function getFormattedDateAttribute()
    {
        return date('F j, Y', strtotime($this->visit_date));
    }

    /**
     * Get the formatted time for the visit.
     *
     * @return string
     */
    public function getFormattedTimeAttribute()
    {
        return date('g:i A', strtotime($this->visit_time));
    }

    /**
     * Scope a query to only include visits from a specific date range.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $startDate
     * @param  string  $endDate
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('visit_date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include visits to a specific page.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $page
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePage($query, $page)
    {
        return $query->where('page_visited', $page);
    }
}
