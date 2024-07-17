import { SignedIn, SignedOut, SignInButton, UserButton, UserProfile } from "@clerk/clerk-react";
import Navbar from "./component/Navbar";
import { Button } from "@material-tailwind/react";
import { Hero } from "./component/Hero";


{/* <SignedOut>
<SignInButton />
</SignedOut>

<SignedIn>
<UserButton />
</SignedIn> */}


export default function App() {
  return (
  <>
     <div className="">
      <Hero/>


     </div>
  </>
  )
}
