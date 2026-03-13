import React, { useState } from 'react';
import { particleThemes, getThemeById } from '../themes';
import { useParticleTheme } from '../context/ParticleContext';

export interface ThemeSelectorProps {
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Accent color for active states */
  accentColor?: string;
}

/**
 * A floating theme selector button + drawer panel.
 * Must be used inside a `<ParticleProvider>`.
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

  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { bottom: 80, right: 16 },
    'bottom-left': { bottom: 80, left: 16 },
    'top-right': { top: 80, right: 16 },
    'top-left': { top: 80, left: 16 },
  };

  const drawerSide = position.includes('right') ? 'right' : 'left';

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="Theme Settings"
        style={{
          position: 'fixed',
          ...positionStyles[position],
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
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
        }}
      >
        {currentTheme.icon}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.3)',
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          [drawerSide]: 0,
          width: 320,
          maxWidth: '85vw',
          height: '100vh',
          zIndex: 10001,
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
          transform: open ? 'translateX(0)' : `translateX(${drawerSide === 'right' ? '100%' : '-100%'})`,
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16 }}>Particle Theme</span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#999',
              padding: 4,
            }}
          >
            &times;
          </button>
        </div>

        {/* Theme list */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...particleThemes, {
            id: 'none',
            name: 'None',
            icon: '\uD83D\uDEAB',
            description: 'Disable particle effects',
          }].map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
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
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Icon */}
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

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: isActive ? accentColor : '#1f2937',
                    }}
                  >
                    {theme.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                    {theme.description}
                  </div>
                </div>

                {/* Check mark */}
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

        {/* Tip */}
        <div style={{ padding: '0 16px 16px', marginTop: 'auto' }}>
          <div
            style={{
              padding: 16,
              background: '#f9fafb',
              borderRadius: 12,
              fontSize: 13,
              color: '#6b7280',
              lineHeight: 1.6,
            }}
          >
            Your theme selection is automatically saved and will be remembered on your next visit.
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeSelector;
