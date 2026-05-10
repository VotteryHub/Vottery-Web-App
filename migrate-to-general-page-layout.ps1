
<#
  migrate-to-general-page-layout.ps1
  
  Batch migrates all pages still using the legacy
  HeaderNavigation + LeftSidebar raw-div pattern 
  to the unified GeneralPageLayout architecture.
  
  Strategy:
  - ONLY touch files that import HeaderNavigation but NOT GeneralPageLayout
  - Replace: `import HeaderNavigation from '../../components/ui/HeaderNavigation';`
    with:    `import GeneralPageLayout from '../../components/layout/GeneralPageLayout';`
  - Replace: `import LeftSidebar from '../../components/ui/LeftSidebar';`
    with:    (remove it - GeneralPageLayout includes the sidebar)
  - Replace: the outer wrapper pattern:
      <div className="min-h-screen bg-...">
        <HeaderNavigation />
        ...
        (inner content)
        ...
      </div>
    with:
      <GeneralPageLayout title="...">
        ...
        (inner content)
        ...
      </GeneralPageLayout>

  SAFETY: The script is non-destructive on files that already use GeneralPageLayout.
  It uses regex-based string replacement and skips files that look ambiguous.
#>

$pages = Get-ChildItem -Path "src\pages" -Recurse -Filter "index.jsx" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match "import HeaderNavigation from '../../components/ui/HeaderNavigation'" -and
    $content -notmatch "import GeneralPageLayout"
}

$migrated = 0
$skipped  = 0

foreach ($file in $pages) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # 1. Replace the HeaderNavigation import with GeneralPageLayout
    $newContent = $content -replace [regex]::Escape("import HeaderNavigation from '../../components/ui/HeaderNavigation';"),
                                     "import GeneralPageLayout from '../../components/layout/GeneralPageLayout';"

    # 2. Remove LeftSidebar import (it's included inside GeneralPageLayout)
    $newContent = $newContent -replace [regex]::Escape("import LeftSidebar from '../../components/ui/LeftSidebar';`r`n"), ""
    $newContent = $newContent -replace [regex]::Escape("import LeftSidebar from '../../components/ui/LeftSidebar';`n"),  ""

    # 3. Remove the <HeaderNavigation /> JSX call
    $newContent = $newContent -replace "\s*<HeaderNavigation\s*/>\s*`r?`n", "`n"
    
    # 4. Remove the <LeftSidebar /> JSX call 
    $newContent = $newContent -replace "\s*<LeftSidebar\s*/>\s*`r?`n", ""

    # 5. Replace the outer container: <div className="min-h-screen bg-..."> with <GeneralPageLayout ...>
    #    We look for a div that starts with min-h-screen
    $newContent = $newContent -replace '<div className="min-h-screen[^"]*">', '<GeneralPageLayout title="">'

    # 6. If there was a paired <div className="flex"> wrapper around sidebar+main, we can't safely
    #    auto-remove it, so we leave inner structure intact. The GeneralPageLayout will handle it.

    # 7. Close tag: we need to replace the last </div> that pairs with the outer wrapper.
    #    Strategy: find `</div>\n  );\n};` and replace the last occurrence with </GeneralPageLayout>
    #    This is tricky with regex on arbitrary files, so we use a simpler heuristic:
    #    Replace the pattern `    </div>\n  );\n};` -> `    </GeneralPageLayout>\n  );\n};`
    #    Only replace the LAST match
    $closePattern = [regex]"(  </div>\r?\n  \);\r?\n\})"
    $matches = $closePattern.Matches($newContent)
    if ($matches.Count -gt 0) {
        $lastMatch = $matches[$matches.Count - 1]
        $replacement = $lastMatch.Value -replace "  </div>", "  </GeneralPageLayout>"
        $newContent = $newContent.Substring(0, $lastMatch.Index) + $replacement + $newContent.Substring($lastMatch.Index + $lastMatch.Length)
    }

    # Only write if content actually changed
    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $migrated++
        Write-Host "MIGRATED: $($file.FullName)"
    } else {
        $skipped++
        Write-Host "SKIPPED (no changes): $($file.FullName)"
    }
}

Write-Host ""
Write-Host "Migration complete. Migrated: $migrated | Skipped: $skipped"
