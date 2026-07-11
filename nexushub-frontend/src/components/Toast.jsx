function Toast({ message, show }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg shadow-lg text-sm z-50">
      {message}
    </div>
  );
}
export default Toast;