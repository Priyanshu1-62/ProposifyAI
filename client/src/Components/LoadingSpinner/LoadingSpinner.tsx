
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm">
      <img className="w-20 md:w-28 lg:w-32 h-auto" src="/Loading.gif" alt="Loading Spinner GIF"></img>
    </div>
  )
}

export default LoadingSpinner