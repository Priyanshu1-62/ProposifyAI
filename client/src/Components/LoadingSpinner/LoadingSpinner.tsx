
function LoadingSpinner() {
  return (
    <div className="absolute z-6 w-screen h-screen flex justify-center items-center">
      <img className="w-20 md:w-28 lg:w-32 h-auto" src="/Loading.gif" alt="Loading Spinner GIF"></img>
    </div>
  )
}

export default LoadingSpinner