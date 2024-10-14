
import { AnyRecord } from "dns";
import Login from "./components/Auth/Login";

type Props = {
  setRoute: any;
}

export default function Home(setRoute: (route: string) => void) {
  return (
    <div className="h-screen items-center justify-center flex">
      <Login setRoute={setRoute} />
    </div>
  );
}
