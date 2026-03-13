-- Supported Locales (canonical language list for Web + Mobile)

CREATE TABLE IF NOT EXISTS public.supported_locales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_code TEXT NOT NULL, -- e.g. 'en-US', 'af', 'es-CL'
  language_code TEXT NOT NULL, -- e.g. 'en', 'af'
  region_code TEXT NULL, -- e.g. 'US', 'GB'
  name TEXT NOT NULL, -- Human-readable name, e.g. 'English (US)'
  is_default BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_supported_locales_code
  ON public.supported_locales(locale_code);

CREATE INDEX IF NOT EXISTS idx_supported_locales_enabled
  ON public.supported_locales(enabled, sort_order);

ALTER TABLE public.supported_locales ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supported_locales'
      AND policyname = 'Users can read supported locales'
  ) THEN
    CREATE POLICY "Users can read supported locales"
    ON public.supported_locales
    FOR SELECT
    USING (enabled = true);
  END IF;
END;
$$;

-- Seed initial locales only if table is empty
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.supported_locales;
  IF v_count = 0 THEN
    INSERT INTO public.supported_locales (locale_code, language_code, region_code, name, is_default, enabled, sort_order)
    VALUES
      ('af', 'af', NULL, 'Afrikaans', false, true, 10),
      ('gn', 'gn', NULL, 'Guaraní', false, true, 20),
      ('ay', 'ay', NULL, 'Aymara', false, true, 30),
      ('az', 'az', NULL, 'Azeri', false, true, 40),
      ('id', 'id', NULL, 'Indonesian', false, true, 50),
      ('ms', 'ms', NULL, 'Malay', false, true, 60),
      ('jv', 'jv', NULL, 'Javanese', false, true, 70),
      ('bs', 'bs', NULL, 'Bosnian', false, true, 80),
      ('ca', 'ca', NULL, 'Catalan', false, true, 90),
      ('cs', 'cs', NULL, 'Czech', false, true, 100),
      ('chr', 'chr', NULL, 'Cherokee', false, true, 110),
      ('cy', 'cy', NULL, 'Welsh', false, true, 120),
      ('da', 'da', NULL, 'Danish', false, true, 130),
      ('se', 'se', NULL, 'Northern Sámi', false, true, 140),
      ('de', 'de', NULL, 'German', false, true, 150),
      ('et', 'et', NULL, 'Estonian', false, true, 160),
      ('en-IN', 'en', 'IN', 'English (India)', false, true, 170),
      ('en-GB', 'en', 'GB', 'English (UK)', false, true, 180),
      ('en-US', 'en', 'US', 'English (US)', true, true, 190),
      ('es', 'es', NULL, 'Spanish', false, true, 200),
      ('es-CL', 'es', 'CL', 'Spanish (Chile)', false, true, 210),
      ('es-CO', 'es', 'CO', 'Spanish (Colombia)', false, true, 220),
      ('es-ES', 'es', 'ES', 'Spanish (Spain)', false, true, 230),
      ('es-MX', 'es', 'MX', 'Spanish (Mexico)', false, true, 240),
      ('es-VE', 'es', 'VE', 'Spanish (Venezuela)', false, true, 250),
      ('eo', 'eo', NULL, 'Esperanto', false, true, 260),
      ('eu', 'eu', NULL, 'Basque', false, true, 270),
      ('fil', 'fil', NULL, 'Filipino', false, true, 280),
      ('fo', 'fo', NULL, 'Faroese', false, true, 290),
      ('fr-FR', 'fr', 'FR', 'French (France)', false, true, 300),
      ('fr-CA', 'fr', 'CA', 'French (Canada)', false, true, 310),
      ('fy', 'fy', NULL, 'Frisian', false, true, 320),
      ('ga', 'ga', NULL, 'Irish', false, true, 330),
      ('gl', 'gl', NULL, 'Galician', false, true, 340),
      ('ko', 'ko', NULL, 'Korean', false, true, 350),
      ('hr', 'hr', NULL, 'Croatian', false, true, 360),
      ('xh', 'xh', NULL, 'Xhosa', false, true, 370),
      ('zu', 'zu', NULL, 'Zulu', false, true, 380),
      ('is', 'is', NULL, 'Icelandic', false, true, 390),
      ('it', 'it', NULL, 'Italian', false, true, 400),
      ('ka', 'ka', NULL, 'Georgian', false, true, 410),
      ('sw', 'sw', NULL, 'Swahili', false, true, 420),
      ('tlh', 'tlh', NULL, 'Klingon', false, true, 430),
      ('ku', 'ku', NULL, 'Kurdish', false, true, 440),
      ('lv', 'lv', NULL, 'Latvian', false, true, 450),
      ('lt', 'lt', NULL, 'Lithuanian', false, true, 460),
      ('li', 'li', NULL, 'Limburgish', false, true, 470),
      ('la', 'la', NULL, 'Latin', false, true, 480),
      ('hu', 'hu', NULL, 'Hungarian', false, true, 490),
      ('mg', 'mg', NULL, 'Malagasy', false, true, 500),
      ('mt', 'mt', NULL, 'Maltese', false, true, 510),
      ('nl', 'nl', NULL, 'Dutch', false, true, 520),
      ('nl-BE', 'nl', 'BE', 'Dutch (België)', false, true, 530),
      ('ja', 'ja', NULL, 'Japanese', false, true, 540),
      ('nb', 'nb', NULL, 'Norwegian (Bokmål)', false, true, 550),
      ('nn', 'nn', NULL, 'Norwegian (Nynorsk)', false, true, 560),
      ('uz', 'uz', NULL, 'Uzbek', false, true, 570),
      ('pl', 'pl', NULL, 'Polish', false, true, 580),
      ('pt-BR', 'pt', 'BR', 'Portuguese (Brazil)', false, true, 590),
      ('pt-PT', 'pt', 'PT', 'Portuguese (Portugal)', false, true, 600),
      ('qu', 'qu', NULL, 'Quechua', false, true, 610),
      ('ro', 'ro', NULL, 'Romanian', false, true, 620),
      ('rm', 'rm', NULL, 'Romansh', false, true, 630),
      ('ru', 'ru', NULL, 'Russian', false, true, 640),
      ('sq', 'sq', NULL, 'Albanian', false, true, 650),
      ('sk', 'sk', NULL, 'Slovak', false, true, 660),
      ('sl', 'sl', NULL, 'Slovenian', false, true, 670),
      ('so', 'so', NULL, 'Somali', false, true, 680),
      ('fi', 'fi', NULL, 'Finnish', false, true, 690),
      ('sv', 'sv', NULL, 'Swedish', false, true, 700),
      ('th', 'th', NULL, 'Thai', false, true, 710),
      ('vi', 'vi', NULL, 'Vietnamese', false, true, 720),
      ('tr', 'tr', NULL, 'Turkish', false, true, 730),
      ('zh-CN', 'zh', 'CN', 'Simplified Chinese (China)', false, true, 740),
      ('zh-TW', 'zh', 'TW', 'Traditional Chinese (Taiwan)', false, true, 750),
      ('zh-HK', 'zh', 'HK', 'Traditional Chinese (Hong Kong)', false, true, 760),
      ('el', 'el', NULL, 'Greek', false, true, 770),
      ('grc', 'grc', NULL, 'Classical Greek', false, true, 780),
      ('be', 'be', NULL, 'Belarusian', false, true, 790),
      ('bg', 'bg', NULL, 'Bulgarian', false, true, 800),
      ('kk', 'kk', NULL, 'Kazakh', false, true, 810),
      ('mk', 'mk', NULL, 'Macedonian', false, true, 820),
      ('mn', 'mn', NULL, 'Mongolian', false, true, 830),
      ('sr', 'sr', NULL, 'Serbian', false, true, 840),
      ('tt', 'tt', NULL, 'Tatar', false, true, 850),
      ('tg', 'tg', NULL, 'Tajik', false, true, 860),
      ('uk', 'uk', NULL, 'Ukrainian', false, true, 870),
      ('hy', 'hy', NULL, 'Armenian', false, true, 880),
      ('yi', 'yi', NULL, 'Yiddish', false, true, 890),
      ('he', 'he', NULL, 'Hebrew', false, true, 900),
      ('ur', 'ur', NULL, 'Urdu', false, true, 910),
      ('ar', 'ar', NULL, 'Arabic', false, true, 920),
      ('ps', 'ps', NULL, 'Pashto', false, true, 930),
      ('fa', 'fa', NULL, 'Persian', false, true, 940),
      ('syc', 'syc', NULL, 'Syriac', false, true, 950),
      ('ne', 'ne', NULL, 'Nepali', false, true, 960),
      ('mr', 'mr', NULL, 'Marathi', false, true, 970),
      ('sa', 'sa', NULL, 'Sanskrit', false, true, 980),
      ('hi', 'hi', NULL, 'Hindi', false, true, 990),
      ('bn', 'bn', NULL, 'Bengali', false, true, 1000),
      ('pa', 'pa', NULL, 'Punjabi', false, true, 1010),
      ('gu', 'gu', NULL, 'Gujarati', false, true, 1020),
      ('ta', 'ta', NULL, 'Tamil', false, true, 1030),
      ('te', 'te', NULL, 'Telugu', false, true, 1040),
      ('kn', 'kn', NULL, 'Kannada', false, true, 1050),
      ('ml', 'ml', NULL, 'Malayalam', false, true, 1060),
      ('km', 'km', NULL, 'Khmer', false, true, 1070);
  END IF;
END;
$$;

