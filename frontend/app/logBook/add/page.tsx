import Heading from "@/components/Heading";
import SaveNewLogBtn from "@/components/log/SaveNewLogBtn";

const AddLog = () => {
  return (
    <>
      <Heading pageTitle="Add New Log" />
      <form action="#" className="w-11/12 max-w-xl h-fit mx-auto my-12">
        <p className="mb-8 text-eyeCatchDark">* indicates mandatory</p>

        {/* Log number */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="logNo" className="w-24 text-wrap">Log No.<span className="text-eyeCatchDark">*</span></label>
          <div className="w-8/12">
            <input
              type="number"
              name="logNo"
              placeholder="Log no."
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
          <p className="text-eyeCatchDark text-end">error arimasu</p>
          </div>
        </div>

        {/* Date */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="date" className="w-24 text-wrap">Date<span className="text-eyeCatchDark">*</span></label>
          <div className="w-8/12">
            <input
              type="date"
              name="date"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">error arimasu</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="logNo" className="w-24 text-wrap">Purpose</label>
          <div className="w-8/12">
            <select name="purpose" id="purpose" className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black">
              <option value="" > --- Select purpose --- </option>
              <option value="1" >Recreational</option>
              <option value="2" >Training</option>
              <option value="3" >Technical</option>
            </select>
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Course */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="course" className="w-24 text-wrap">Course</label>
          <div className="w-8/12">
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Location */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="location" className="w-24 text-wrap">Location</label>
          <div className="w-8/12">
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Country */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="logNo" className="w-24 text-wrap">Country/ Region</label>
          <div className="w-8/12">
            <select name="purpose" id="country_region" className="bg-lightBlue dark:bg-baseWhite w-full h-8 px-2 rounded-sm text-black">
              <option value="" > --- Please select --- </option>
              <option value="1" >Thailand</option>
              <option value="2" >Phillipines</option>
              <option value="3" >Indonesia</option>
            </select>
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Weather */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="weather" className="w-24 text-wrap">Weathe</label>
          <div className="w-8/12">
            <input
              type="text"
              name="weather"
              placeholder="Weather"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Surface Temperature */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="surfaceTemperature" className="w-24 text-wrap">Surface temperature</label>
          <div className="w-8/12">
            <input
              type="number"
              name="surfaceTemperature"
              placeholder="Surface temperature"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">error arimasu</p>
          </div>
        </div>

        {/* Water Temperature */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="waterTemperature" className="w-24 text-wrap">Water temperature</label>
          <div className="w-8/12">
            <input
              type="number"
              name="waterTemperature"
              placeholder="Water temperature"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">error arimasu</p>
          </div>
        </div>

        {/* Start time */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="startTime" className="w-24 text-wrap">Start time<span className="text-eyeCatchDark">*</span></label>
          <div className="w-8/12">
            <input
              type="time"
              name="startTime"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* End time */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="endTime" className="w-24 text-wrap">End time</label>
          <div className="w-8/12">
            <input
              type="time"
              name="endTime"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Tank pressure start */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="tankPresureStart" className="w-24 text-wrap">Tank pressure start</label>
          <div className="w-8/12">
            <input
              type="number"
              name="tankPresureStart"
              placeholder="Tank pressure start"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Tank pressure end */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="tankPresureEnd" className="w-24 text-wrap">Tank pressure end</label>
          <div className="w-8/12">
            <input
              type="number"
              name="tankPresureEnd"
              placeholder="Tank pressure end"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end"></p>
          </div>
        </div>

        {/* Weight */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="weight" className="w-24 text-wrap">Weight added</label>
          <div className="w-8/12">
            <input
              type="number"
              name="weight"
              placeholder="Weight added"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Suit */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="suit" className="w-24 text-wrap">Suit</label>
          <div className="w-8/12">
            <input
              type="text"
              name="suit"
              placeholder="Suit"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Max depth */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="maxDepth" className="w-24 text-wrap">Max depth</label>
          <div className="w-8/12">
            <input
              type="number"
              name="maxDepth"
              placeholder="Max depth"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Visibility */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="visibility" className="w-24 text-wrap">Visibility</label>
          <div className="w-8/12">
            <input
              type="number"
              name="visibility"
              placeholder="Visibility"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Buddy */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="buddy" className="w-24 text-wrap">Buddy</label>
          <div className="w-8/12">
            <input
              type="text"
              name="buddy"
              placeholder="Buddy"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Instructor */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="instructor" className="w-24 text-wrap">Instructor</label>
          <div className="w-8/12">
            <input
              type="text"
              name="instructor"
              placeholder="Instructor"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Dive Center */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <label htmlFor="diveCenter" className="w-24 text-wrap">Dive Center</label>
          <div className="w-8/12">
            <input
              type="text"
              name="diveCenter"
              placeholder="Dive Center"
              className="w-full h-8 bg-lightBlue dark:bg-baseWhite px-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Note */}
        <div className="w-full h-fit my-3 flex flex-col items-start">
          <label htmlFor="note" className="w-24 text-wrap">Note</label>
          <div className="w-full">
            <textarea
              name="note"
              id="note"
              placeholder="Dive Center"
              className="w-full h-60 bg-lightBlue dark:bg-baseWhite px-2 mt-2 rounded-s text-black"
            />
            <p className="text-eyeCatchDark text-end">{}</p>
          </div>
        </div>

        {/* Is draft */}
        <div className="w-full h-14 my-3 flex justify-between items-start">
          <div className="w-8/12">
            <input
              type="checkbox"
              name="isDraft"
            />
            <label htmlFor="isDraft" className="w-24 text-wrap ml-2">Save as draft</label>
          </div>
          <p className="text-eyeCatchDark text-end">{}</p>
        </div>

        <div className="w-full text-center">
          <SaveNewLogBtn />
        </div>
      </form>
    </>
  );
}

export default AddLog;