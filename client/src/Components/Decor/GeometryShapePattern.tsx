
function GeometryShapePattern() {
  return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[10vw] rounded-l-[4rem] bg-[#880d1e] hover:bg-[#8f5f65] transition-all ease-in duration-150 delay-75"></div>
                <div className="relative w-[10vw] h-[10vw]">
                    <div className="absolute top-0 w-full h-[12%] bg-[#f5cb5c] hover:bg-[#f4e2b1] transition-all ease-in duration-150 delay-75"></div>
                    <div className="absolute h-full w-[12%] left-0 bg-[#f5cb5c] hover:bg-[#f4e2b1] transition-all ease-in duration-150 delay-75"></div>
                    <div className="absolute h-full w-[12%] right-0 bg-[#f5cb5c] hover:bg-[#f4e2b1] transition-all ease-in duration-150 delay-75"></div>
                    <div className="absolute bottom-0 w-full h-[12%] bg-[#f5cb5c] hover:bg-[#f4e2b1] transition-all ease-in duration-150 delay-75"></div>
                </div>
                <div className="w-[10vw] h-[10vw] rounded-l-[4rem] rounded-t-[4rem] bg-[#b9c6ae] hover:bg-[#e6ebe2] transition-all ease-in duration-150 delay-75"></div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[10vw] flex justify-center items-center">
                    <div className="w-[7vw] h-[7vw] bg-[#f58f29] rotate-45 hover:bg-[#f6b471] transition-all ease-in duration-150 delay-75"></div>
                </div>
                <div className="w-[10vw] h-[10vw] z-1 rounded-full bg-[#8cb369] hover:bg-[#c2eb9d] transition-all ease-in duration-150 delay-75"></div>
                <div className="relative w-[10vw] h-[10vw]">
                    <div className="absolute h-[110%] w-[10%] bottom-0 -left-1 bg-[#754668] origin-bottom rotate-27 rounded-4xl hover:bg-[#a76f97] transition-all ease-in duration-150 delay-75"></div>
                    <div className="absolute h-[110%] w-[10%] bottom-0 -right-1 bg-[#754668] origin-bottom -rotate-27 rounded-4xl hover:bg-[#a76f97] transition-all ease-in duration-150 delay-75"></div>
                    <div className="absolute bottom-0 w-full h-[10%] bg-[#754668] rounded-4xl hover:bg-[#a76f97] transition-all ease-in duration-150 delay-75"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="w-[10vw] h-[20vw] bg-[#156064] rounded-r-full hover:bg-[#507e81] transition-all ease-in duration-150 delay-75"></div>
                <div className="w-[10vw] h-[10vw] bg-[#754668] rounded-tr-full hover:bg-[#ab6f9a] transition-all ease-in duration-150 delay-75"></div>
            </div>
        </div>
  )
}

export default GeometryShapePattern