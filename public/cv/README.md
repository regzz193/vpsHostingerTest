# Curriculum Vitae Directory

This directory is intended for storing curriculum vitae (CV) files that need to be publicly accessible in the application.

## Usage

### Storing CV Files

You can store CV files in this directory by:
1. Manually copying files to this directory
2. Using Laravel's file upload functionality to save files here

### Accessing CV Files in Code

You can access CV files in this directory using Laravel's Storage facade:

```php
// Store an uploaded CV file in the cv directory
$path = $request->file('cv')->store('/', 'cv');

// Get the URL for a CV file
$url = Storage::disk('cv')->url($path);

// Check if a CV file exists
$exists = Storage::disk('cv')->exists($path);

// Delete a CV file
Storage::disk('cv')->delete($path);
```

### Accessing CV Files in Blade Templates

You can reference CV files in your Blade templates like this:

```html
<a href="{{ asset('cv/your-cv-file.pdf') }}" class="btn btn-primary">Download CV</a>
```

Or for displaying a PDF in the browser:

```html
<embed src="{{ asset('cv/your-cv-file.pdf') }}" type="application/pdf" width="100%" height="600px">
```

## Important Notes

1. This directory is publicly accessible, so do not store sensitive personal information in CV files.
2. For user-uploaded content, consider implementing validation to ensure only appropriate file types (PDF, DOCX, etc.) are stored.
3. Consider implementing file size limits to prevent large uploads.
4. For large applications, consider using a CDN or cloud storage solution like AWS S3 for better performance and scalability.
5. Implement proper security measures to protect against malicious file uploads.
