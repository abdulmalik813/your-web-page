'use client'

import { useEffect, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import { getServerSideURL } from '@/lib/get-url'

interface GoogleFont {
  id: string
  family: string
  subsets: string[]
  weights: number[]
  styles: string[]
  defSubset: string
  variable: boolean
  category: string
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--theme-text)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    maxHeight: '300px',
    overflowY: 'auto' as const,
    backgroundColor: 'var(--theme-elevation-0)',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '12px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--theme-elevation-100)',
    transition: 'background-color 0.15s',
  },
  dropdownTitle: {
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '4px',
    color: 'var(--theme-text)',
  },
  dropdownMeta: {
    fontSize: '12px',
    color: 'var(--theme-elevation-600)',
  },
  configPanel: {
    padding: '16px',
    backgroundColor: 'var(--theme-elevation-50)',
    borderRadius: '6px',
    border: '1px solid var(--theme-elevation-200)',
    marginBottom: '16px',
  },
  fontTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'var(--theme-text)',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeDefault: {
    backgroundColor: 'var(--theme-elevation-200)',
    color: 'var(--theme-text)',
  },
  badgeSuccess: {
    backgroundColor: 'var(--theme-elevation-400)',
    color: 'var(--theme-bg)',
  },
  section: {
    marginBottom: '16px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  button: {
    padding: '8px 16px',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  buttonDefault: {
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
  },
  buttonActive: {
    backgroundColor: 'var(--theme-elevation-900)',
    color: 'var(--theme-bg)',
    border: '1px solid var(--theme-elevation-900)',
  },
  actionBar: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    paddingTop: '12px',
    borderTop: '1px solid var(--theme-elevation-200)',
  },
  buttonSecondary: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-0)',
    color: 'var(--theme-text)',
    border: '1px solid var(--theme-elevation-200)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  buttonPrimary: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-900)',
    color: 'var(--theme-bg)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  buttonDisabled: {
    padding: '8px 16px',
    backgroundColor: 'var(--theme-elevation-200)',
    color: 'var(--theme-elevation-500)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '13px',
    fontWeight: '500',
  },
  currentSelection: {
    padding: '12px',
    backgroundColor: 'var(--theme-elevation-100)',
    border: '1px solid var(--theme-elevation-300)',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentSelectionText: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--theme-text)',
  },
  clearButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: 'var(--theme-text)',
    border: '1px solid var(--theme-elevation-400)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  centerText: {
    padding: '20px',
    textAlign: 'center' as const,
    color: 'var(--theme-elevation-600)',
  },
  loadingText: {
    padding: '8px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: 'var(--theme-elevation-600)',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'var(--theme-elevation-200)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--theme-elevation-900)',
    transition: 'width 0.3s ease',
  },
}

// Track which font families have had a preview <link> injected
const injectedPreviewFonts = new Set<string>()

function injectFontPreview(family: string) {
  if (injectedPreviewFonts.has(family)) return
  injectedPreviewFonts.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`
  document.head.appendChild(link)
}

export function FontFamilySearchField({ path }: { path: string }) {
  const familyPath = path
  const fontDataPath = familyPath.replace('.family', '.fontData')
  const { value: familyValue, setValue: setFamily } = useField<string>({ path: familyPath })
  const { setValue: setFontData } = useField<any>({ path: fontDataPath })

  const [searchTerm, setSearchTerm] = useState('')
  const [allFonts, setAllFonts] = useState<GoogleFont[]>([])
  const [isLoadingFonts, setIsLoadingFonts] = useState(false)
  const [selectedFont, setSelectedFont] = useState<GoogleFont | null>(null)
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedSubset, setSelectedSubset] = useState<string | null>(null)
  const [fontsCache, setFontsCache] = useState<{ fonts: GoogleFont[]; timestamp: number } | null>(
    null,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState('')

  useEffect(() => {
    const loadFonts = async () => {
      try {
        setIsLoadingFonts(true)

        if (fontsCache && Date.now() - fontsCache.timestamp < 604800000) {
          setAllFonts(fontsCache.fonts)
          setIsLoadingFonts(false)
          return
        }

        const response = await fetch('https://api.fontsource.org/v1/fonts')
        if (!response.ok) throw new Error('Failed to fetch fonts')

        const fonts = await response.json()
        setAllFonts(fonts)
        setFontsCache({ fonts, timestamp: Date.now() })
        setIsLoadingFonts(false)
      } catch (error) {
        console.error('Error loading fonts:', error)
        setIsLoadingFonts(false)
      }
    }

    if (searchTerm && allFonts.length === 0) {
      loadFonts()
    }
  }, [searchTerm, allFonts.length, fontsCache])

  const filteredFonts = useMemo(
    () =>
      searchTerm
        ? allFonts
            .filter((font) => font.family.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 50)
        : [],
    [searchTerm, allFonts],
  )
  const showResults = Boolean(searchTerm)

  const handleFontSelect = (font: GoogleFont) => {
    setSelectedFont(font)
    setSearchTerm('')
    setSelectedWeight(font.variable ? 400 : font.weights[0] || null)
    setSelectedStyle(font.styles[0] || null)
    setSelectedSubset(font.defSubset)
  }

  const handleSave = async () => {
    if (!selectedFont || !selectedWeight || !selectedStyle || !selectedSubset) {
      alert('Please select weight, style, and subset')
      return
    }

    setIsSaving(true)
    setDownloadProgress(0)
    setDownloadStatus('Fetching font CSS...')

    try {
      let cssUrl: string

      if (selectedFont.variable) {
        cssUrl = `https://cdn.jsdelivr.net/npm/@fontsource-variable/${selectedFont.id}@latest/index.css`
      } else {
        const stylePrefix = selectedStyle === 'italic' ? 'italic' : ''
        cssUrl = stylePrefix
          ? `https://cdn.jsdelivr.net/npm/@fontsource/${selectedFont.id}@latest/${selectedWeight}-${stylePrefix}.css`
          : `https://cdn.jsdelivr.net/npm/@fontsource/${selectedFont.id}@latest/${selectedWeight}.css`
      }

      const cssResponse = await fetch(cssUrl)
      let fontCSS: string

      if (!cssResponse.ok) {
        cssUrl = selectedFont.variable
          ? `https://cdn.jsdelivr.net/npm/@fontsource-variable/${selectedFont.id}@latest/index.css`
          : `https://cdn.jsdelivr.net/npm/@fontsource/${selectedFont.id}@latest/index.css`

        const fallbackResponse = await fetch(cssUrl)
        if (!fallbackResponse.ok) throw new Error('Failed to fetch font CSS')
        fontCSS = await fallbackResponse.text()
      } else {
        fontCSS = await cssResponse.text()
      }

      setDownloadProgress(20)

      const fontFaceRegex = /@font-face\s*{[^}]*}/g
      const fontFaceRules = fontCSS.match(fontFaceRegex) || []

      const filteredRules: string[] = []

      for (const rule of fontFaceRules) {
        const matchesWeight =
          selectedFont.variable || rule.includes(`font-weight: ${selectedWeight}`)
        const matchesStyle = rule.includes(`font-style: ${selectedStyle}`)
        const matchesSubset = rule.includes(`unicode-range:`)
          ? rule.toLowerCase().includes(selectedSubset.toLowerCase())
          : true

        if (matchesWeight && matchesStyle && matchesSubset) {
          filteredRules.push(rule)
        }
      }

      fontCSS = filteredRules.join('\n\n')

      const fontFileUrls: string[] = []
      const urlRegex = /url\((\.\/files\/[^)]+)\)/g
      let match
      while ((match = urlRegex.exec(fontCSS)) !== null) {
        fontFileUrls.push(match[1])
      }

      setDownloadStatus(`Processing ${fontFileUrls.length} font file(s)...`)

      const baseUrl = selectedFont.variable
        ? `https://cdn.jsdelivr.net/npm/@fontsource-variable/${selectedFont.id}@latest/`
        : `https://cdn.jsdelivr.net/npm/@fontsource/${selectedFont.id}@latest/`

      const uploadedFontFiles: { filename: string; url: string }[] = []

      for (let i = 0; i < fontFileUrls.length; i++) {
        const fileUrl = fontFileUrls[i]
        const filename = fileUrl.split('/').pop()!

        setDownloadStatus(`Checking ${filename} (${i + 1}/${fontFileUrls.length})...`)

        const queryParams = new URLSearchParams({
          'where[filename][equals]': filename,
          'where[fontId][equals]': selectedFont.id,
          limit: '1',
        })

        const checkResponse = await fetch(`/api/font-files?${queryParams.toString()}`, {
          method: 'GET',
          credentials: 'include',
        })

        let fileUrl_uploaded: string

        if (checkResponse.ok) {
          const checkResult = await checkResponse.json()
          if (checkResult.docs && checkResult.docs.length > 0) {
            setDownloadStatus(`Using existing ${filename} (${i + 1}/${fontFileUrls.length})...`)
            fileUrl_uploaded = checkResult.docs[0].url
          } else {
            setDownloadStatus(`Uploading ${filename} (${i + 1}/${fontFileUrls.length})...`)

            const fullUrl = baseUrl + fileUrl.replace('./', '')
            const response = await fetch(fullUrl)

            if (!response.ok) throw new Error(`Failed to download ${filename}`)

            const blob = await response.blob()

            const formData = new FormData()
            formData.append('file', blob, filename)
            formData.append(
              '_payload',
              JSON.stringify({
                filename,
                fontId: selectedFont.id,
              }),
            )

            const uploadResponse = await fetch('/api/font-files', {
              method: 'POST',
              body: formData,
              credentials: 'include',
            })

            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json()
              throw new Error(
                `Failed to upload ${filename}: ${errorData.errors?.[0]?.message || 'Unknown error'}`,
              )
            }

            const uploadResult = await uploadResponse.json()
            fileUrl_uploaded = uploadResult.doc.url
          }
        } else {
          const errorData = await checkResponse.json()
          throw new Error(
            `Failed to check ${filename}: ${errorData.errors?.[0]?.message || 'Unknown error'}`,
          )
        }

        uploadedFontFiles.push({
          filename: filename,
          url: fileUrl_uploaded,
        })

        setDownloadProgress(20 + ((i + 1) / fontFileUrls.length) * 70)
      }

      setDownloadStatus('Finalizing...')
      setDownloadProgress(95)
      const serverUrl = getServerSideURL()
      uploadedFontFiles.forEach(({ filename, url }) => {
        const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        fontCSS = fontCSS.replace(
          new RegExp(`url\\(\\.\/files\/${escapedFilename}\\)`, 'g'),
          `url(${url.replaceAll(serverUrl, '')})`,
        )
      })

      setFamily(selectedFont.family)
      setFontData({
        id: selectedFont.id,
        family: selectedFont.family,
        category: selectedFont.category,
        variable: selectedFont.variable,
        weight: selectedWeight,
        style: selectedStyle,
        subset: selectedSubset,
        fontCSS: fontCSS,
      })

      setDownloadProgress(100)
      setDownloadStatus('Complete!')

      setTimeout(() => {
        setSelectedFont(null)
        setSelectedWeight(null)
        setSelectedStyle(null)
        setSelectedSubset(null)
        setIsSaving(false)
        setDownloadProgress(0)
        setDownloadStatus('')
      }, 500)
    } catch (error) {
      console.error('Error processing fonts:', error)
      alert(`Failed to process fonts: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsSaving(false)
      setDownloadProgress(0)
      setDownloadStatus('')
    }
  }

  const handleClear = () => {
    setFamily('')
    setFontData(null)
    setSelectedFont(null)
    setSelectedWeight(null)
    setSelectedStyle(null)
    setSelectedSubset(null)
    setSearchTerm('')
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <label style={styles.label}>Search Font Family</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Type to search fonts (e.g., 'Roboto', 'Inter')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />

          {showResults && (
            <div style={styles.dropdown}>
              {isLoadingFonts ? (
                <div style={styles.centerText}>Loading fonts...</div>
              ) : filteredFonts.length > 0 ? (
                filteredFonts.map((font) => {
                  injectFontPreview(font.family)
                  return (
                    <div
                      key={font.id}
                      onClick={() => handleFontSelect(font)}
                      style={styles.dropdownItem}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div
                        style={{
                          ...styles.dropdownTitle,
                          fontFamily: `'${font.family}', sans-serif`,
                        }}
                      >
                        {font.family}
                      </div>
                      <div style={styles.dropdownMeta}>
                        {font.category} • {font.variable ? 'Variable' : 'Static'} •{' '}
                        {font.weights.length} weights
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={styles.centerText}>No fonts found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedFont && (
        <div style={styles.configPanel}>
          <div style={styles.section}>
            <h3 style={{ ...styles.fontTitle, fontFamily: `'${selectedFont.family}', sans-serif` }}>
              {selectedFont.family}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ ...styles.badge, ...styles.badgeDefault }}>
                {selectedFont.category}
              </span>
              <span
                style={{
                  ...styles.badge,
                  ...(selectedFont.variable ? styles.badgeSuccess : styles.badgeDefault),
                }}
              >
                {selectedFont.variable ? 'Variable' : 'Static'}
              </span>
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>
              Weight {selectedFont.variable && '(Variable: 100-900)'}
            </label>
            {selectedFont.variable ? (
              <input
                type="text"
                inputMode="numeric"
                value={selectedWeight?.toString() ?? ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '')
                  setSelectedWeight(raw === '' ? null : parseInt(raw, 10))
                }}
                onBlur={() => {
                  const val = selectedWeight ?? 400
                  setSelectedWeight(Math.min(900, Math.max(100, val)))
                }}
                style={styles.input}
                placeholder="Enter weight (100-900)"
              />
            ) : (
              <div style={styles.buttonGroup}>
                {selectedFont.weights.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    style={{
                      ...styles.button,
                      ...(selectedWeight === weight ? styles.buttonActive : styles.buttonDefault),
                    }}
                    onMouseEnter={(e) => {
                      if (selectedWeight !== weight) {
                        e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedWeight !== weight) {
                        e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                      }
                    }}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Style</label>
            <div style={styles.buttonGroup}>
              {selectedFont.styles.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  style={{
                    ...styles.button,
                    ...(selectedStyle === style ? styles.buttonActive : styles.buttonDefault),
                    textTransform: 'capitalize',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedStyle !== style) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedStyle !== style) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                    }
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Character Subset</label>
            <div style={styles.buttonGroup}>
              {selectedFont.subsets.map((subset) => (
                <button
                  key={subset}
                  type="button"
                  onClick={() => setSelectedSubset(subset)}
                  style={{
                    ...styles.button,
                    ...(selectedSubset === subset ? styles.buttonActive : styles.buttonDefault),
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSubset !== subset) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSubset !== subset) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                    }
                  }}
                >
                  {subset}
                </button>
              ))}
            </div>
          </div>

          {isSaving && (
            <div style={styles.section}>
              <div style={styles.loadingText}>{downloadStatus}</div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${downloadProgress}%` }} />
              </div>
            </div>
          )}

          <div style={styles.actionBar}>
            <button
              type="button"
              onClick={() => setSelectedFont(null)}
              style={styles.buttonSecondary}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedWeight || !selectedStyle || !selectedSubset || isSaving}
              style={
                !selectedWeight || !selectedStyle || !selectedSubset || isSaving
                  ? styles.buttonDisabled
                  : styles.buttonPrimary
              }
            >
              {isSaving ? 'Processing...' : 'Save Font'}
            </button>
          </div>
        </div>
      )}

      {familyValue && !selectedFont && (
        <div style={styles.currentSelection}>
          <div style={styles.currentSelectionText}>Current Font: {familyValue}</div>
          <button type="button" onClick={handleClear} style={styles.clearButton}>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
