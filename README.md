# SUNIX

تطبيق الطاقة الشمسية باستخدام **React Native + Expo + JavaScript فقط**. تم تنفيذ شاشة الترحيب المحمولة من المرجع المعتمد، بينما تظل الشاشات الأخرى placeholders إلى حين استلام تصاميمها.

## التقنيات والقرار المعماري

Expo SDK 57 / React Native 0.86.3 / React 19.2.3، وفق [إصدار Expo المستقر](https://expo.dev/changelog/sdk-57) و[مصفوفة الاعتماديات الرسمية](https://github.com/expo/expo/blob/sdk-57/packages/expo/bundledNativeModules.json). Expo يتيح تطوير Android وiOS من قاعدة واحدة، مع توليد المشاريع الأصلية عند الحاجة. ملفات التطبيق والتهيئة JavaScript؛ بعض حزم الطرف الثالث تتضمن تعريفات TypeScript داخل node_modules، ولا يستخدمها المشروع.

الطبقات: `Screen → Hook → Service → API/Storage`. لا تستدعي الشاشات الشبكة مباشرة. TanStack Query يدير بيانات الخادم والتحميل والأخطاء؛ Zustand يدير الجلسة والاختيارات فقط. مسودات المحادثة محلية داخل hook، وذاكرة الاستعلامات تُمسح عند تغير الجلسة.

## التشغيل

استخدم Node.js LTS المتوافق مع Expo وnpm. ثم:

```sh
npm install
npx expo install --fix
npx expo install --check
```

انسخ `.env.example` إلى `.env` وأدخل عنوان API عند توفره. أثناء التطوير يعمل تدفق رمز التحقق عبر adapter تجريبي معزول عند ضبط `EXPO_PUBLIC_USE_MOCK_OTP=true` أو عند غياب عنوان API. الرمز التجريبي هو `482716` ويُملأ تلقائيًا في شاشة التحقق. في الإنتاج لا يعمل هذا المسار ويجب توفير Backend.

```sh
npm start
npm run android
npm run ios
```

Android يحتاج جهازًا أو محاكي Android SDK. تشغيل محاكي iOS والبناء المحلي يتطلب macOS وXcode؛ لا يمكن التحقق منه على Windows. يُفضّل development build:

```sh
npm run native:android
npm run native:ios
```

## البناء

بعد اختيار معرفَي حزمة Android وiOS، أضف `android.package` و`ios.bundleIdentifier` إلى `app.config.js`. لم تُخترع معرفات ملكية أو حساب EAS.

```sh
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --profile development --platform android
npx eas-cli build --profile production --platform all
```

ملف `eas.json` يحدد development/preview/production. عيّن `EXPO_PUBLIC_API_URL` المناسب في بيئة EAS. متغيرات EXPO_PUBLIC مضمنة في التطبيق ومكشوفة؛ لا تضع فيها أسرارًا أو مفاتيح AI. استخدم HTTPS للإنتاج، واجعل مفاتيح AI على الخادم فقط. iOS scene support مفعّل لتوافق Xcode 27.

## هيكل المشروع

```text
src/
  api/          HTTP client, query cache
  assets/       Approved assets only
  components/   Accessible, replaceable base components
  config/       Public environment configuration
  constants/    Shared keys
  context/      Providers and account-scoped selections
  hooks/        UI-facing state and operations
  models/       Runtime domain contracts
  navigation/   Guest/protected nested flows
  screens/      Mobile Welcome screen and route placeholders
  services/     auth, chat, projects, products, maintenance,
                notifications, profile, files, preferences
  state/        Session and local selections
  storage/      Replaceable async/secure adapters
  theme/        Central SUNIX tokens
  utils/        Unified application errors
  validation/   Reusable form schemas
tests/          Jest behavior tests
scripts/        Dependency-free foundation verification
```

## شاشة الترحيب المحمولة

المسار الأول للضيف هو `Welcome`. تم تنفيذ نسخة الهاتف فقط من المرجع: خلفية السماء والمناظر، شعار SUNIX، العنوان، أزرار الحساب وتسجيل الدخول والضيف، والنص القانوني. زر إنشاء الحساب يفتح `Register`، وزر تسجيل الدخول يفتح `Login`، وزر الضيف يدخل `Main`. لا توجد أي عناصر من تخطيط سطح المكتب.

شاشة `Register` تنفذ مرجع بيانات المستخدم واختيار WhatsApp أو SMS. عند صحة الاسم والرقم تطلب رمز OTP ثم تنتقل إلى `VerifyPhone`، التي تدعم رمزًا من ست خانات، التعبئة التلقائية للنظام، العد التنازلي، إعادة الإرسال، والرجوع لتعديل الرقم. حالات التحميل والخطأ ظاهرة، ونجاح التحقق ينشئ جلسة عبر controller الجلسة. خدمة OTP التجريبية منفصلة عن مساري Backend `/auth/verification/request` و`/auth/verification/verify`.

الأصول المستخدمة موجودة في `src/assets/images/`. خلفية الشاشة والشعار مشتقان من المرجع المرئي بواسطة أداة ImageGen، ثم استُخدما كأصول محلية دون اتصال شبكي.

## إضافة شاشة لاحقًا

حلل التصميم المرسل، أعد استخدام المكونات المناسبة، ثم أنشئ الشاشة في `src/screens/<feature>/`. استبدل ربط `UnimplementedScreen` للشاشة المطلوبة داخل navigator. استخدم hooks للخدمات والحالة و`useTheme` للهوية؛ لا تنقل business logic إلى JSX. لا تغير جميع المسارات لتشير إلى شاشة واحدة عند إضافة تصميم واحد.

المسارات جاهزة لـ Auth وMain وChatbot وProjects وProducts وProfile وNotifications وMaintenance. مسارات Main لا تُركّب للضيف، ومسارات Auth لا تُركّب للمستخدم المسجل. بعد ربط الشاشات: `navigation.navigate('Projects', { screen: 'ProjectDetails', params: { projectId } })`. تمرر المعرّفات فقط؛ التفاصيل تُجلب بواسطة الخدمة.

## العقود والحدود الحالية

راجع [عقد Backend المقترح](docs/backend-contract.md). المسارات وعقود الاستجابات مقترحة وليست API مثبتة. عند توفير Backend تعدّل الخدمات والموديلات في مكانها. الجلسة تستخدم SecureStore؛ الإعدادات وبيانات الاختيارات تستخدم AsyncStorage مع فصل الحسابات. الرموز والرسائل الحساسة لا توضع في التخزين العادي. لا يوجد refresh token دون اتفاق Backend؛ انتهاء الجلسة يتطلب تسجيل الدخول مجددًا.

خدمات الملفات تطلب الصلاحيات عند الاستخدام فقط، تدعم الإلغاء والتحقق من الحجم ورفع multipart. المحادثات والصيانة ترفع الملفات أولًا وترسل معرفاتها. فشل عملية لاحقة قد يترك ملفًا مؤقتًا؛ يجب على Backend تنظيف الملفات غير المرتبطة. الإشعارات الحالية بيانات داخل التطبيق مع عقد adapter مستقبلًا لـ push، وليست تسجيل push فعليًا.

المكونات مرنة بلا تصميم نهائي. GlassCard أساس Card حاليًا، وSkeleton ثابت دون حركة مفترضة. يمكن تغيير الثيم عبر ThemeProvider. شاشة الترحيب هي الواجهة الوحيدة المصممة حاليًا.

## التحقق

```sh
npm run check:foundation
npm run lint
npm run format
npm run format:check
npm test
npm run doctor
npm run export
```

**حالة التسليم:** ثُبتت الاعتماديات وحُفظ `package-lock.json`. نجحت فحوص ESLint وPrettier وJest وExpo Doctor، ونجح Metro في تصدير حزمتَي Android وiOS. لم يتوفر جهاز Android أو `adb` على هذا الجهاز للاختبار اللمسي الفعلي، كما يتطلب تشغيل iOS محليًا macOS وXcode.

اختبار الجهاز المطلوب بعد التثبيت: تشغيل بارد، استعادة جلسة صالحة/منتهية، تسجيل خروج ثم دخول بحساب آخر، حماية المسارات، رفض صلاحية الكاميرا، إلغاء اختيار ملف، انقطاع الشبكة ورفع ملف. واجهات الاختبار النهائية تنتظر التصاميم وBackend.
