'use client';
import { useState, useEffect } from "react";
// import { useDebouncedCallback } from 'use-debounce';
import { toast } from "react-toastify";
import { getMyDivePlans } from "@/actions/divePlan/getMyDivePlans";
import { DivePlanHighLight, isDivePlanHighlightArray } from "@/types/divePlanTypes"
import Heading from "@/components/Heading";
import PlanCard from "@/components/plans/PlanCard";

const Plans = () => {
    const [divePlans, setDivePlans] = useState<DivePlanHighLight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
      const getDivePlans = async() => {
        setIsLoading(true);

        try {
          const plans = await getMyDivePlans()
          setDivePlans(isDivePlanHighlightArray(plans) ? plans : []);
          setIsError(false);
        } catch (error) {
          setIsError(true);
          toast.error('Failed to find dive plans');
          console.log('error:', error);
        } finally {
          setIsLoading(false);
        }
      }

      getDivePlans();
    }, []);

  return (
    <>
      <Heading pageTitle="Dive Plans" />

      <div className="w-8/12 md:w-1/3 max-w-md h-fit mx-auto mt-6 mb-12 ">
        { isError ? (
            <p>Error occurred</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : divePlans.length === 0 ? (
            <p>No dive plans</p>
          ) : isDivePlanHighlightArray(divePlans) && (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center md:flex-row md:justify-center md:flex-wrap pt-4 pb-10">
              {divePlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  id={plan.id}
                  user_id={plan.user_id}
                  date={plan.date}
                  location={plan.location}
                  country_name={plan.country?.name}
                  is_visitor={false}
                  />
              ))}
            </div>
          )
        }
      </div>
    </>
  );
}

export default Plans;