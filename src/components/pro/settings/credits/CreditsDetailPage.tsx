import CreditsDetailItemSection from "./CreditsDetailItemSection";
import Heading from "../../../UI/Heading";
import Input from "../../../UI/Input";
import Button from "../../../UI/Button";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";

function CreditsDetailPage() {
  const url = `https://erranddo.com/admin/api/v1/user-requests?for_pro=1&show_only_count=1`;

  let { data: count } = useSWR(url, fetcher);

  count = count?.data;

  return (
    <div>
      <div className=" tracking-wider px-5 py-2">
        <Heading
          variant="headingTitle"
          text={`Available Credits : ${count?.user?.available_credits}`}
          headingclassname="!text-xl text-primaryYellow"
        />
      </div>
      <div className="grid xl:grid-cols-4 xs:grid-cols-1 md:grid-cols-2 gap-6">
        <CreditsDetailItemSection
          creditscore={16}
          amount={28}
          perCreditAmount={1.75}
          percentage={""}
        />
        <CreditsDetailItemSection
          creditscore={30}
          amount={49.8}
          perCreditAmount={1.66}
          percentage={"5%"}
        />
        <CreditsDetailItemSection
          creditscore={44}
          amount={70.84}
          perCreditAmount={1.61}
          percentage={"8%"}
        />
        <CreditsDetailItemSection
          creditscore={60}
          amount={92.4}
          perCreditAmount={1.54}
          percentage={"12%"}
        />
        <CreditsDetailItemSection
          creditscore={90}
          amount={135.0}
          perCreditAmount={1.5}
          percentage={"14%"}
        />
        <CreditsDetailItemSection
          creditscore={126}
          amount={185.22}
          perCreditAmount={1.47}
          percentage={"16%"}
        />
        <CreditsDetailItemSection
          creditscore={126}
          amount={185.22}
          perCreditAmount={1.47}
          percentage={"18%"}
        />
        <CreditsDetailItemSection
          creditscore={126}
          amount={185.22}
          perCreditAmount={1.47}
          percentage={"20%"}
        />
      </div>
      <div className="py-10 px-5 flex gap-3 items-center">
        <Input
          placeholder="Have a promo code?"
          type="text"
          className="bg-slate-200 xs:w-64"
        />
        <Button buttonClassName="h-10 w-20">Enter</Button>
      </div>
    </div>
  );
}

export default CreditsDetailPage;
