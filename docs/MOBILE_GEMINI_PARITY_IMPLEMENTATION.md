# Mobile Gemini Parity — Implementation Guide

Use this in the **Flutter (vottery M)** project so Mobile uses **Gemini** for SMS optimization and chat like Web, and logs `optimization_type: 'gemini'`.

---

## 1. Add `lib/services/ai/gemini_chat_service.dart`

Create this file so Mobile can call the same **ai-proxy** Edge with `provider: 'gemini'`:

```dart
import 'package:supabase_flutter/supabase_flutter.dart';
import 'ai_service_base.dart';

/// Calls the shared ai-proxy Supabase Edge with provider: gemini.
/// Use for SMS optimization and any chat flow that should match Web (Gemini).
class GeminiChatService {
  static GeminiChatService? _instance;
  static GeminiChatService get instance => _instance ??= GeminiChatService._();

  GeminiChatService._();

  static final _supabase = Supabase.instance.client;

  /// Send messages to Gemini via ai-proxy. Returns assistant text.
  static Future<String> sendChat(List<Map<String, String>> messages, {int maxTokens = 1024}) async {
    final response = await AIServiceBase.invokeAIFunction('ai-proxy', {
      'provider': 'gemini',
      'method': 'chat',
      'payload': {
        'messages': messages,
        'model': 'gemini-1.5-flash',
        'max_tokens': maxTokens,
        'temperature': 0.7,
      },
    });

    final choices = response['choices'] as List<dynamic>?;
    final content = choices?.isNotEmpty == true
        ? (choices!.first as Map<String, dynamic>)['message'] as Map<String, dynamic>?
        : null;
    final text = content?['content'] as String?;
    return text?.trim() ?? '';
  }
}
```

---

## 2. Update `OpenAISMSOptimizerService` to use Gemini and log `optimization_type: 'gemini'`

- **Primary path:** Call `GeminiChatService.sendChat` instead of Dio to `api.openai.com`.
- **Logging:** When writing to `sms_optimization_history` (or equivalent), set `optimization_type: 'gemini'` to match Web.

Example change for the method that today calls `_callOpenAI(prompt)`:

- Replace the OpenAI Dio call with:

```dart
final optimizedMessage = await GeminiChatService.sendChat([
  {'role': 'system', 'content': systemPrompt},
  {'role': 'user', 'content': userPrompt},
], maxTokens: 200);
```

- In the same method, when you log the optimization (e.g. to Supabase), set:

```dart
'optimization_type': 'gemini',
```

- Keep a **fallback**: if `GeminiChatService.sendChat` throws (e.g. no auth or Edge error), catch and fall back to the existing `_callOpenAI` if you still want a fallback, or surface the error. Prefer making Gemini the only path to match Web.

---

## 3. Optional: Quest and other Edge functions

- Web uses **Gemini** for quests via **ai-proxy** (provider `gemini`). Mobile today calls **openai-quest-generation**.
- To align Mobile with Web:
  - Either update the **openai-quest-generation** Edge function to call Gemini instead of OpenAI, or
  - From Mobile, call **ai-proxy** with `provider: 'gemini'` and the same payload shape as Web (messages + model + max_tokens) and parse `choices[0].message.content` for the quest JSON.

Same idea can be applied to other flows (e.g. fraud, embeddings) by routing them through ai-proxy with `provider: 'gemini'` or by changing the backend Edge to use Gemini.

---

## 4. Summary

| Item | Web | Mobile (after this) |
|------|-----|----------------------|
| SMS optimization | `geminiChatService.generateContent` / ai-proxy gemini | `GeminiChatService.sendChat` (ai-proxy gemini) |
| optimization_type | `'gemini'` | `'gemini'` |
| Quest / chat | ai-proxy gemini | Optional: call ai-proxy gemini or update Edge to Gemini |

After this, there is no remaining “Mobile Gemini discrepancy” for SMS optimization, and the same constant `optimization_type: 'gemini'` is used on both platforms.
