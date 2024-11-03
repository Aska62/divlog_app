import Heading from "@/components/Heading";
import EditLogBtn from "@/components/log/EditLogBtn";

type LogPageProps = {
  params: {
    id: string
  }
}

const LogPage:React.FC<LogPageProps> = async ({ params }) => {
  const { id } = await params;

  return (
  <>
    <Heading pageTitle={`Log No. ${id}`} />

    <div className="w-10/12 max-w-md h-fit mx-auto mb-12">
      <div className="text-right">
        <EditLogBtn id={id} />
      </div>

      {/* Date */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">On </p>
        <p className="text-lg">2024/08/24</p>
      </div>

      {/* Location + Country/region */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">At </p>
        <p className="text-lg">Green Lagoon, Colong Islands Philippines</p>
      </div>

      {/* Purpose */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">For </p>
        <p className="text-lg">Training</p>
      </div>

      {/* Course */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Course </p>
        <p className="text-lg">Advanced Open Water</p>
      </div>

      {/* Weather */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Weather </p>
        <p className="text-lg">Cloudy</p>
      </div>

      {/* Temperatuer */}
      <div className="my-3 md:flex md:items-baseline">
        <p className="text-sm mr-2">Temperatuer</p>
        <div className="flex items-baseline ml-3">
          <div className="flex items-baseline mr-3">
            <p className="text-sm mr-1">Surface </p>
            <p className="text-lg">38 &#176;C</p>
          </div>
          <div className="flex items-baseline">
            <p className="text-sm mr-1">Water </p>
            <p className="text-lg">32 &#176;C</p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="my-3 md:flex md:items-baseline">
        <p className="text-sm mr-2">Time </p>
        <div className="flex items-baseline ml-3">
          <div className="flex items-baseline mr-3">
            <p className="text-sm mr-1">From </p>
            <p className="text-lg">12:48</p>
          </div>
          <div className="flex items-baseline">
            <p className="text-sm mr-1">Till </p>
            <p className="text-lg">13:36</p>
          </div>
        </div>

        <div className="flex items-baseline ml-3">
          <div className="flex items-baseline mr-3">
            <p className="text-sm mr-1">Duration </p>
            <p className="text-lg">48 mins</p>
          </div>
        </div>
      </div>

      {/* Tank pressure */}
      <div className="my-3 md:flex md:items-baseline">
        <p className="text-sm mr-2">Tank pressure </p>
        <div className="flex items-baseline ml-3">
          <div className="flex items-baseline mr-3">
            <p className="text-sm mr-1">Start </p>
            <p className="text-lg">200</p>
          </div>
          <div className="flex items-baseline">
            <p className="text-sm mr-1">End </p>
            <p className="text-lg">80</p>
          </div>
        </div>
      </div>

      {/* Weight */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Added weight </p>
        <p className="text-lg">3 kg</p>
      </div>

      {/* Suit */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Suit </p>
        <p className="text-lg">5mm wet</p>
      </div>

      {/* Max depth */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Max depth </p>
        <p className="text-lg">29 m</p>
      </div>

      {/* Visibility */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Visibility </p>
        <p className="text-lg">8 m</p>
      </div>

      {/* Buddy */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Buddy </p>
        <p className="text-lg">Maxim Veramosa</p>
      </div>

      {/* Instructor */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Instructor </p>
        <p className="text-lg">Shawn Wan Leonard</p>
      </div>

      {/* Dive center */}
      <div className="flex items-baseline my-3">
        <p className="text-sm mr-2">Dive center </p>
        <p className="text-lg">DivLog Divers Colong</p>
      </div>

      {/* Note */}
      <div className="my-3">
        {/* <p className="text-sm mb-1">Note </p> */}
        <p className="text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

    </div>
  </> );
}

export default LogPage;