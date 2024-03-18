import Profile from "@/components/profile/profile";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/actions";

interface Name {
  name: string;
}
interface UserData {
  profile: Name;
}

interface ProfileProps {
  userData: UserData;
}

export async function Page() {
  const userData5 = {
    profile: {
      name: "ravi sharma",
    },
  };

  return (
    <div>
      <Profile userData={userData5} />
    </div>
  );
}

export default Page;
