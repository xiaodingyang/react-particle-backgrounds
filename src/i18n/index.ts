export type Locale = 'zh-CN' | 'en-US';

type TranslationKey = string;

const translations: Record<Locale, Record<TranslationKey, string>> = {
  'zh-CN': {
    'theme.starline': '星轨',
    'theme.snow': '飘雪',
    'theme.bubble': '气泡',
    'theme.stars': '星空',
    'theme.firefly': '萤火虫',
    'theme.geometry': '几何',
    'theme.wave': '海浪3D',
    'theme.wave2d': '海浪2D',
    'theme.tyndall': '丁达尔',
    'theme.none': '无',
    'selector.title': '粒子主题',
    'selector.close': '关闭',
    'selector.triggerLabel': '打开主题选择器',
    'selector.noneDesc': '关闭粒子效果',
    'selector.tip': '你的主题选择会自动保存，下次访问时将自动恢复。',
    'loading.text': '加载中...',
    'a11y.background': (name: string) => `${name}粒子背景`,
    'a11y.backgroundStatic': (name: string) => `${name}粒子背景（静态）`,
  } as unknown as Record<TranslationKey, string>,

  'en-US': {
    'theme.starline': 'Star Trail',
    'theme.snow': 'Snowfall',
    'theme.bubble': 'Bubbles',
    'theme.stars': 'Starry Night',
    'theme.firefly': 'Firefly',
    'theme.geometry': 'Geometry',
    'theme.wave': 'Wave 3D',
    'theme.wave2d': 'Wave 2D',
    'theme.tyndall': 'Tyndall',
    'theme.none': 'None',
    'selector.title': 'Particle Themes',
    'selector.close': 'Close',
    'selector.triggerLabel': 'Open theme selector',
    'selector.noneDesc': 'Disable particle effects',
    'selector.tip': 'Your theme selection is automatically saved.',
    'loading.text': 'Loading...',
    'a11y.background': (name: string) => `${name} particle background`,
    'a11y.backgroundStatic': (name: string) => `${name} particle background (static)`,
  } as unknown as Record<TranslationKey, string>,
};

/**
 * 获取翻译文本。
 */
export function t(key: TranslationKey, locale: Locale = 'zh-CN'): string {
  return translations[locale]?.[key] ?? key;
}
