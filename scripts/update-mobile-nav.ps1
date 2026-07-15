$base = "C:\Users\Administrator\Desktop\MARKAJANTYEDEK"

function Mobile-NavHtml($home, $jantlar, $lastikler, $servicesBtn, $degisim, $onarim, $oteli, $balans, $sss, $iletisim) {
  $homeCls = if ($home) { " mobile-nav__link--active" } else { "" }
  $jantCls = if ($jantlar) { " mobile-nav__link--active" } else { "" }
  $lastikCls = if ($lastikler) { " mobile-nav__link--active" } else { "" }
  $svcBtnCls = if ($servicesBtn) { " mobile-nav__link--active" } else { "" }
  $degCls = if ($degisim) { " mobile-nav__sublink--active" } else { "" }
  $onaCls = if ($onarim) { " mobile-nav__sublink--active" } else { "" }
  $oteCls = if ($oteli) { " mobile-nav__sublink--active" } else { "" }
  $balCls = if ($balans) { " mobile-nav__sublink--active" } else { "" }
  $sssCls = if ($sss) { " mobile-nav__link--active" } else { "" }
  $iletCls = if ($iletisim) { " mobile-nav__link--active" } else { "" }

  return @"
    <nav class="mobile-nav" id="mobileMenu" aria-hidden="true">
      <div class="mobile-nav__overlay" data-mobile-nav-close></div>
      <div class="mobile-nav__panel">
        <a href="index.html" class="mobile-nav__logo" aria-label="Ana sayfa">
          <img src="assets/images/logo-white.webp" alt="Marka Jant Lastik" width="160" height="48" decoding="async">
        </a>
        <ul class="mobile-nav__menu">
          <li><a href="index.html" class="mobile-nav__link$homeCls">Ana Sayfa</a></li>
          <li><a href="jantlar.html" class="mobile-nav__link$jantCls">Jantlar</a></li>
          <li><a href="lastikler.html" class="mobile-nav__link$lastikCls">Lastikler</a></li>
          <li class="mobile-nav__accordion">
            <button type="button" class="mobile-nav__accordion-btn$svcBtnCls" aria-expanded="false" aria-controls="mobileNavServices">
              <span>Hizmetler</span>
              <svg class="mobile-nav__chevron" width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <ul class="mobile-nav__accordion-panel" id="mobileNavServices">
              <li><a href="lastik-degisimi.html" class="mobile-nav__sublink$degCls">Lastik Değişimi</a></li>
              <li><a href="jant-onarim.html" class="mobile-nav__sublink$onaCls">Jant Onarımı</a></li>
              <li><a href="lastik-oteli.html" class="mobile-nav__sublink$oteCls">Lastik Oteli</a></li>
              <li><a href="balans.html" class="mobile-nav__sublink$balCls">Balans</a></li>
            </ul>
          </li>
          <li><a href="sss.html" class="mobile-nav__link$sssCls">SSS</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link$iletCls">İletişim</a></li>
          <li><a href="iletisim.html" class="mobile-nav__link mobile-nav__link--cta">Bilgi AI</a></li>
        </ul>
      </div>
    </nav>
"@
}

$pages = @{
  "index.html" = @(1,0,0,0,0,0,0,0,0,0)
  "jantlar.html" = @(0,1,0,0,0,0,0,0,0,0)
  "lastikler.html" = @(0,0,1,0,0,0,0,0,0,0)
  "sss.html" = @(0,0,0,0,0,0,0,0,1,0)
  "iletisim.html" = @(0,0,0,0,0,0,0,0,0,1)
  "lastik-degisimi.html" = @(0,0,0,1,1,0,0,0,0,0)
  "jant-onarim.html" = @(0,0,0,1,0,1,0,0,0,0)
  "lastik-oteli.html" = @(0,0,0,1,0,0,1,0,0,0)
  "balans.html" = @(0,0,0,1,0,0,0,1,0,0)
}

$pattern = '(?s)\s*<div class="site-header__mobile" id="mobileMenu".*?</div>\s*</div>'

foreach ($file in $pages.Keys) {
  $path = Join-Path $base $file
  $flags = $pages[$file]
  $replacement = Mobile-NavHtml @flags[0] @flags[1] @flags[2] @flags[3] @flags[4] @flags[5] @flags[6] @flags[7] @flags[8] @flags[9]
  $content = Get-Content $path -Raw -Encoding UTF8
  $updated = [regex]::Replace($content, $pattern, "`n$replacement", 1)
  if ($updated -eq $content) { Write-Host "WARN: no match in $file" }
  else { Set-Content $path $updated -Encoding UTF8 -NoNewline; Write-Host "OK: $file" }
}
