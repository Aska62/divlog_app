'use client';
import { useState, useEffect } from "react";
// import { useDebouncedCallback } from 'use-debounce';
import { toast } from "react-toastify";
import { getMyDivePlans } from "@/actions/divePlan/getMyDivePlans";
import { DivePlanHighLight, isDivePlanHighlightArray } from "@/types/divePlanTypes"
import Heading from "@/components/Heading";

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

      { isError ? (
          <p>Error occurred</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : divePlans.length === 0 ? (
          <p>No dive plans</p>
        ) : isDivePlanHighlightArray(divePlans) && (
          <div>
            {divePlans.map((plan) => (
              <div key={plan.id}>
                <p>{plan.location}</p>
                <p>{plan.country?.name || 'no country name'}</p>
              </div>
            ))}
          </div>
        )
      }
    </>
  );
}

export default Plans;