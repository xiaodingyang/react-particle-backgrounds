import React, { useState, useMemo, useCallback } from 'react';
import { particleThemes, getThemeById } from '../themes';
import { useParticleTheme } from '../context/ParticleContext';

export interface ThemeSelectorProps {
  /** 在屏幕上的位置 */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** 激活状态的强调色 */
  accentColor?: string;
}

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'bottom-right': { bottom: 80, right: 16 },
  'bottom-left': { bottom: 80, left: 16 },
  'top-right': { top: 80, right: 16 },
  'top-left': { top: 80, left: 16 },
};

const BUTTON_BASE_STYLE: React.CSSProperties = {
  position: 'fixed',
  zIndex: 9999,
  width: 44,
  height: 44,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  fontSize: 20,
  transition: 'transform 0.3s, box-shadow 0.3s',
};

const BACKDROP_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  background: 'rgba(0, 0, 0, 0.3)',
  transition: 'opacity 0.3s',
};

const DRAWER_BASE_STYLE: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  width: 320,
  maxWidth: '85vw',
  height: '100vh',
  zIndex: 10001,
  background: '#fff',
  boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
  transition: 'transform 0.3s ease',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #f0f0f0',
};

const CLOSE_BUTTON_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 20,
  cursor: 'pointer',
  color: '#999',
  padding: 4,
};

const LIST_STYLE: React.CSSProperties = {
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const TIP_CONTAINER_STYLE: React.CSSProperties = {
  padding: '0 16px 16px',
  marginTop: 'auto',
};

const TIP_STYLE: React.CSSProperties = {
  padding: 16,
  background: '#f9fafb',
  borderRadius: 12,
  fontSize: 13,
  color: '#6b7280',
  lineHeight: 1.6,
};

const THEME_LIST = [...particleThemes, {
  id: 'none',
  name: '无',
  icon: '🚫',
  description: '关闭粒子效果',
}];

/**
 * 浮动主题选择器按钮 + 抽屉面板。
 * 必须在 `<ParticleProvider>` 内使用。
 *
 * ```tsx
 * <ParticleProvider>
 *   <ParticlesBackground />
 *   <ThemeSelector />
 * </ParticleProvider>
 * ```
 */
const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  position = 'bottom-right',
  accentColor = '#3b82f6',
}) => {
  const [open, setOpen] = useState(false);
  const { themeId, setTheme } = useParticleTheme();
  const currentTheme = getThemeById(themeId);

  const drawerSide = position.includes('right') ? 'right' : 'left';

  const buttonStyle = useMemo(() => ({
    ...BUTTON_BASE_STYLE,
    ...POSITION_STYLES[position],
  }), [position]);

  const drawerStyle = useMemo(() => ({
    ...DRAWER_BASE_STYLE,
    [drawerSide]: 0,
    transform: open ? 'translateX(0)' : `translateX(${drawerSide === 'right' ? '100%' : '-100%'})`,
  }), [drawerSide, open]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleThemeClick = useCallback((id: string) => {
    setTheme(id);
  }, [setTheme]);

  return (
    <>
      <style>{`
        .rpb-trigger-button:hover {
          transform: scale(1.05) translateY(-2px);
        }
        .rpb-theme-item:hover {
          border-color: #e0e0e0 !important;
        }
        .rpb-theme-item.active:hover {
          border-color: ${accentColor} !important;
        }
      `}</style>

      <button
        className="rpb-trigger-button"
        onClick={handleOpen}
        title="主题设置"
        style={buttonStyle}
      >
        {currentTheme.icon}
      </button>

      {open && <div onClick={handleClose} style={BACKDROP_STYLE} />}

      <div style={drawerStyle}>
        <div style={HEADER_STYLE}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>粒子主题</span>
          <button onClick={handleClose} style={CLOSE_BUTTON_STYLE}>
            &times;
          </button>
        </div>

        <div style={LIST_STYLE}>
          {THEME_LIST.map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <div
                key={theme.id}
                className={`rpb-theme-item${isActive ? ' active' : ''}`}
                onClick={() => handleThemeClick(theme.id)}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                  border: `2px solid ${isActive ? accentColor : 'transparent'}`,
                  background: isActive ? `${accentColor}10` : '#f5f5f5',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    background: isActive ? accentColor : '#e5e5e5',
                    flexShrink: 0,
                  }}
                >
                  {theme.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2937' }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                    {theme.description}
                  </div>
                </div>

                {isActive && (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={TIP_CONTAINER_STYLE}>
          <div style={TIP_STYLE}>
            你的主题选择会自动保存，下次访问时将自动恢复。
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSelector;
