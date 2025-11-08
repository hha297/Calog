# --- React Native core ---
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# --- Hermes JS Engine ---
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# --- React Native bridge / JNI ---
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-dontwarn com.facebook.jni.**

# --- Reanimated & Worklets (native C++) ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**
-keep class com.swmansion.worklets.** { *; }
-dontwarn com.swmansion.worklets.**

# --- React Native Gesture Handler (if used) ---
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# --- Prevent removal of JS Exception classes ---
-keep class com.facebook.react.common.JavascriptException { *; }

# --- Prevent stripping of DevSupport for crash logs (optional safe) ---
-keep class com.facebook.react.devsupport.** { *; }
-dontwarn com.facebook.react.devsupport.**

# --- Keep Metro bundle and asset loading ---
-keep class com.facebook.react.packagerconnection.** { *; }
-dontwarn com.facebook.react.packagerconnection.**

# --- Avoid warnings from OkHttp / Fresco (React Native core libs) ---
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn com.facebook.imagepipeline.**
-dontwarn com.facebook.imageformat.**
-dontwarn com.facebook.imageutils.**

# --- Keep your Application class (if you have one) ---
-keep class com.calog.MainApplication { *; }

# --- Optional: keep your MainActivity (entry point) ---
-keep class com.calog.MainActivity { *; }
