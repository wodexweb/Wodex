<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PdfPage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */protected $fillable = [
    'title', 
    'description', 
    'link', 
    'pdf_for', 
    'file_path', 
    'status'
];
    /**
     * Optional: Accessor to get the full URL for the PDF
     * This makes it easier for React to display the link
     */
    protected $appends = ['file_url'];

    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->file_path);
    }
}