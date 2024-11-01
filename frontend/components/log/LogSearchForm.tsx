const LogSearchForm = () => {
  return (
    <form className="flex flex-col w-10/12 max-w-xl py-4 px-5 rounded-sm mx-auto shadow-dl">
      {/* Date */}
      <div className="w-full flex flex-col md:flex-row md:justify-between mb-4">
        <p>Date</p>
        <div className="w-full md:w-10/12 flex flex-col md:flex-row md:justify-between">
          <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
            <label htmlFor="dateFrom" className="text-sm pl-3 md:pl-0 md:px-1">From</label>
            <input
              type="date"
              name="dateFrom"
              placeholder="Date"
              className="bg-lightBlue rounded-sm w-10/12 md:w-full px-1"
            />
          </div>
          <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
            <label htmlFor="dateTo" className="text-sm pl-3 md:pl-0 md:px-1">To</label>
            <input
              type="date"
              name="dateTo"
              placeholder="Date"
              className="bg-lightBlue rounded-sm w-10/12 md:w-full px-1"
            />
          </div>
        </div>
      </div>

      {/* Log No. */}
      <div className="w-full flex flex-col md:flex-row md:justify-between mb-4">
        <p className="w-fit m-0">Log No.</p>
        <div className="w-full md:w-10/12 flex flex-col md:flex-row md:justify-between">
          <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
            <label htmlFor="logNoFrom" className="text-sm pl-3 md:pl-0 md:px-1">From</label>
            <input
              type="number"
              name="logNoFrom"
              placeholder="Log no."
              className="bg-lightBlue rounded-sm w-10/12 md:w-full px-1"
            />
          </div>
          <div className="w-full md:w-6/12 flex justify-between mb-3 md:mx-0">
            <label htmlFor="logNoTo" className="text-sm pl-3 md:pl-0 md:px-1">To</label>
            <input
              type="number"
              name="logNoTo"
              placeholder="Log no."
              className="bg-lightBlue rounded-sm w-10/12 md:w-full px-1"
            />
          </div>
        </div>
      </div>

      {/* Country/region */}
      <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
        <label htmlFor="country">Country/region</label>
        <select
          name="country"
          className="bg-lightBlue rounded-sm w-full md:w-3/5 h-7 self-end md:ml-3 text-lightGray"
        >
          <option value="">Country/region</option>
          <option value="">Country/region</option>
          <option value="">Country/region</option>
          <option value="">Country/region of very long name</option>
        </select>
      </div>

      {/* Buddy */}
      <div className="w-full mb-4 flex flex-col md:flex-row md:justify-between">
        <label htmlFor="buddy">Buddy</label>
        <input
          type="text"
          placeholder="Buddy's name"
          className="bg-lightBlue rounded-sm w-full md:w-3/5 h-7 px-1 self-end md:ml-3"
        />
      </div>

      <button className="self-end bg-lightGray hover:bg-darkBlue duration-75 text-baseWhite px-2 rounded-md">
        Clear
      </button>
    </form>
  );
}

export default LogSearchForm;