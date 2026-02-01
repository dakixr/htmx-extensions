# @dakixr/htmx-download

HTMX extension for handling file downloads (Excel, PDF, etc.) without page reload.

## Features

- Binary file downloads without DOM swapping
- Automatic filename extraction from `Content-Disposition` header
- Works with any file type (Excel, PDF, images, etc.)
- No page reload required

## Installation

```html
<script src="https://unpkg.com/htmx.org"></script>
<script src="packages/download/htmx-download.js"></script>
```

## Usage

```html
<button hx-get="/download/report" hx-ext="htmx-download">
  Download Report
</button>
```

## Server Requirements

Your server must return proper headers:

```
Content-Disposition: attachment; filename="report.xlsx"
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

### Django Example

```python
from django.http import FileResponse
import io
import pandas as pd

def download_excel(request):
    df = pd.DataFrame({"col1": [1, 2], "col2": [3, 4]})
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename="report.xlsx")
```

## How It Works

1. Sets `xhr.responseType = 'arraybuffer'` on `htmx:beforeRequest`
2. On `htmx:beforeSwap`, extracts filename from headers and creates a Blob
3. Triggers download via temporary `<a>` element
4. Prevents HTMX from swapping DOM content

## License

MIT
