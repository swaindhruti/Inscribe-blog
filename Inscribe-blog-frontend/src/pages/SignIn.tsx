import { Quotes } from "../components/Quotes";
import { Auth } from "../components/Auth";

export const SignIn = () => {
  return (
    <div className="grid grid-cols-2">
      <Auth type="signin"/>
      <Quotes />
    </div>
  );
};