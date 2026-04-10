/* Created by Ahmed Eltahan - 2026 */
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // تصفية الأخطاء المعروفة من YouTube API
    const ignoredErrors = [
      "Cannot read properties of null (reading 'getAttribute')",
      "Failed to execute 'postMessage'",
      "The target origin provided",
      "The YouTube player is not attached to the DOM",
    ];

    const isIgnoredError = ignoredErrors.some((msg) =>
      error.message.includes(msg),
    );

    if (isIgnoredError) {
      console.warn("⚠️ تنبيه آمن من YouTube API (يمكن تجاهله):", error.message);
      return { hasError: false };
    }

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const ignoredErrors = [
      "Cannot read properties of null (reading 'getAttribute')",
      "Failed to execute 'postMessage'",
      "The target origin provided",
      "The YouTube player is not attached to the DOM",
    ];

    const isIgnoredError = ignoredErrors.some((msg) =>
      error.message.includes(msg),
    );

    if (!isIgnoredError) {
      console.error("❌ خطأ جديّ:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
          <h2 className="text-red-600 font-bold">حدث خطأ</h2>
          <p className="text-red-500">يرجى إعادة تحميل الصفحة</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
