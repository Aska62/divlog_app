'use client';
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { isOrganizationType, OrganizationType } from '@/types/organizationTypes';

export type OrganizationListType = Array<OrganizationType>

const OrganizationOptions = () => {
  const [organizations, setOrganizations] = useState<OrganizationListType>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/organizations`)
      .then((res) => {
        setOrganizations(res.data);
      })
      .catch((err) => {
        console.log('Error fetching organizations: ', err);
      })

  }, []);

  const options = useMemo(() => {
    if (organizations.length > 0) {
      return organizations.map((organization) => {
        if (isOrganizationType(organization)) {
          return (
            <option
              value={ organization.id }
              key={ organization.id }
            >
              { organization.name }
            </option>
          );
        }
      }
    )
    }
  }, [organizations]);

  return (
    <>
      { options }
    </>
  );
};

export default OrganizationOptions;