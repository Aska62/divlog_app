const LogSearchForm = () => {
  return (
    <form className="flex flex-col w-10/12 max-w-96 py-4 px-5 rounded-sm mx-auto shadow-dl">
      {/* Date */}
      <div className="w-full flex-col mb-4">
        <p>Date</p>
        <div className="w-full flex justify-between mb-3">
          <label htmlFor="dateFrom" className="text-sm pl-3">From</label>
          <input
            type="text"
            name="dateFrom"
            placeholder="Date"
            className="bg-lightBlue rounded-sm w-64 px-1"
          />
        </div>
        <div className="w-full flex justify-between mb-3">
          <label htmlFor="dateTo" className="text-sm pl-3">To</label>
          <input
            type="text"
            name="dateTo"
            placeholder="Date"
            className="bg-lightBlue rounded-sm w-64 px-1"
          />
        </div>
      </div>

      {/* Log No. */}
      <div className="w-full flex-col mb-4">
        <p>Log No.</p>
        <div className="w-full flex justify-between mb-3">
          <label htmlFor="logNoFrom" className="text-sm pl-3">From</label>
          <input
            type="text"
            name="logNoFrom"
            placeholder="Log no."
            className="bg-lightBlue rounded-sm w-64 px-1"
          />
        </div>
        <div className="w-full flex justify-between mb-3">
          <label htmlFor="logNoTo" className="text-sm pl-3">To</label>
          <input
            type="text"
            name="logNoTo"
            placeholder="Log no."
            className="bg-lightBlue rounded-sm w-64 px-1"
          />
        </div>
      </div>

      {/* Country/region */}
      <div className="w-full mb-4 flex flex-col">
        <label htmlFor="country">Country/region</label>
        <select
          name="country"
          className="bg-lightBlue rounded-sm w-full h-7 self-end"
        >
          <option value="">Country/region</option>
          <option value="">Country/region</option>
          <option value="">Country/region</option>
          <option value="">Country/region of very long name</option>
        </select>
      </div>

      {/* Buddy */}
      <div className="w-full mb-4 flex flex-col">
        <label htmlFor="buddy">Buddy</label>
        <input
          type="text"
          placeholder="Buddy's name"
          className="bg-lightBlue rounded-sm w-full h-7 px-1 self-end"
        />
      </div>

      <button className="self-end bg-lightGray hover:bg-darkBlue duration-75 text-baseWhite px-2 rounded-md">
        Clear
      </button>
    </form>
  );
}

export default LogSearchForm;