import { Quotes } from "../components/Quotes";
import { Auth } from "../components/Auth";

export const SignUp = () => {
  return (
    <div className="grid grid-cols-2">
      <Auth type="signup" />
      <Quotes />
    </div>
  );
};
