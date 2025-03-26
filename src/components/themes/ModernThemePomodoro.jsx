import Button from "../Button";
import Time from "../Time";
import {
  ArrowPathIcon,
  PlayIcon,
  StopCircleIcon,
} from "@heroicons/react/24/solid";

function ModernThemePomodoro({
  hours,
  minutes,
  seconds,
  start,
  stop,
  reset,
  type1,
  type2,
  openModal,
  closeModal,
  isModalOpen,
  customTime,
  handleCustomTimeChange,
  handleCustomSubmit,
  runningTask,
}) {
  return (
    <div className="w-full duration-1000 flex flex-col items-center justify-center relative">
      <div className="h-[70vh] mx-auto aspect-video rounded-lg flex flex-col justify-center items-center">
        {/* Timer Display */}
        <Time />
        <div className="flex flex-col items-center justify-center inset-0">
          <h1 className="text-2xl text-start bg-[#0000001e] rounded-md rounded-b-none border border-[#0000001e] border-b-1 border-b-slate-900 w-full px-2">
            {runningTask.title}
          </h1>
          <div className="text-text flex items-center justify-center text-center font-bold text-6xl">
            {hours < 10 ? `0${hours}` : hours}:
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}{" "}
          </div>

          <p className="flex items-center justify-center flex-row">
            break:5min{" "}
            <select
              name="brakOption"
              id="breakOption"
              className="w-4 hover:scale-125 duration-300 cursor-pointer"
            >
              <option
                value="0"
                className="text-red-600 text-sm hover:text-red-600"
              >
                feature comming sooon
              </option>
            </select>
          </p>
        </div>

        {/* Timer preset buttons */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-2">
            <Button
              onClick={type1}
              className="!text-sm bg-slate-600 text-white"
              variant="compact"
            >
              25-30
            </Button>
            <Button
              onClick={type2}
              className="!text-sm bg-slate-600 text-white"
              variant="compact"
            >
              55-60
            </Button>
          </div>

          {/* Custom Time Button */}
          <Button
            onClick={openModal}
            className="bg-slate-600 text-white !text-sm"
            variant="compact"
          >
            Custom Time
          </Button>

          {/* Modal Popup for Custom Time */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[99999] bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="number"
                    name="hours"
                    value={customTime.hours}
                    onChange={handleCustomTimeChange}
                    className="text-lg w-12 px-2 border rounded-md"
                    placeholder="Hours"
                  />
                  <input
                    type="number"
                    name="minutes"
                    value={customTime.minutes}
                    onChange={handleCustomTimeChange}
                    className="text-lg w-12 px-2 border rounded-md"
                    placeholder="Minutes"
                  />
                  <input
                    type="number"
                    name="seconds"
                    value={customTime.seconds}
                    onChange={handleCustomTimeChange}
                    className="text-lg w-12 px-2 border rounded-md"
                    placeholder="Seconds"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomSubmit}
                    className=""
                    variant="primary"
                  >
                    Done
                  </Button>
                  <Button onClick={closeModal} className="" variant="cancel">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="py-4">
          <div className="flex gap-4">
            <button
              className="py-1 px-5 cursor-pointer hover:scale-110 duration-300 border border-text rounded-md bg-transparent hover:bg-transparent hover:backdrop-blur-lg hover:border-1 hover:border-text hover:shadow-2xs backdrop-blur-[2px]"
              onClick={start}
            >
              <PlayIcon className="w-6" />
            </button>
            <button
              className="py-1 px-5 cursor-pointer hover:scale-110 duration-300 border border-text rounded-md bg-transparent hover:bg-transparent hover:backdrop-blur-lg hover:border-1 hover:border-text hover:shadow-2xs backdrop-blur-[2px]"
              onClick={stop}
            >
              <StopCircleIcon className="w-6" />
            </button>
            <button
              className="py-1 px-5 cursor-pointer hover:scale-110 duration-300 border border-text rounded-md bg-transparent hover:bg-transparent hover:backdrop-blur-lg hover:border-1 hover:border-text hover:shadow-2xs backdrop-blur-[2px]"
              onClick={reset}
            >
              <ArrowPathIcon className="w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModernThemePomodoro;
