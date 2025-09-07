'use client'
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import axios from 'axios';
import { Link } from 'react-router-dom';


interface Plantype {
  _id: string;
  name: string;
  typecheck: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BillingCycle() {
  const [isLoading, setIsLoading] = useState(false)
  const [planType, setPlantypes] = useState<Plantype[]>([])
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const fetchPlantype = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${api}/billingcycle`);
      setPlantypes(response.data);
      console.log(response.data, "plan data")
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantype();
  }, []);


  return (
    <div className="max-w-full mx-auto p-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor">Vendor-dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings">Site-Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings/plans">Plans</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing Cycle</h1>
          <p className="text-muted-foreground">
            Manage and track all billing-cycle
          </p>
        </div>
        <Button>
          <Link to='/dashboard/plans'>See your plantypes</Link>
        </Button>
      </div>
      <pre>
       {
        isLoading?(
           "Loading"
        ):(
          JSON.stringify(planType,null,2)
        )
       }
      </pre>
    </div>
  )
};