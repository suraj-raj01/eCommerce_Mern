import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Eye, EyeOff, Edit } from 'lucide-react';
import axios from 'axios';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Skeleton } from "../../../components/ui/skeleton"
import { Link, useNavigate } from 'react-router-dom';

type Plan = {
  _id: string;
  logo: string;
  checklogo: boolean;
  title: string;
  checktitle: boolean;
  subtitle: string;
  checksubtitle: boolean;
  price: number;
  checkprice: boolean;
  duration: string;
  checkduration: boolean;
  description: string;
  checkdescription: boolean;
  features: string[];
  checkfeatures: boolean;
  visibility: boolean;
  buttontext: string;
  checkbutton: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function PlanPage() {

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreating, setIsCreating] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/plans`);
      setPlans(response.data);
      console.log(response.data, "data")
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const router = useNavigate();

  const View = (planId: string) => {
    router(`/dashboard/plans/view/${planId}`)
  };

  const startEdit = (plan: any) => {
    router(`/dashboard/plans/edit/${plan}`)
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <Card
      className={`transition-all duration-300 ${!plan.visibility ? 'opacity-10' : ''
        } shadow-lg rounded-2xl border`}
    >
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-start">

          {plan.checklogo && plan.logo && (
            <div className="text-xl">{plan.logo}</div>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => View(plan._id)}
            >
              {plan.visibility ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startEdit(plan._id)}
            >
              <Edit className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex items-start justify-between gap-4">
            <div>
              {plan.title && (
                <CardTitle className="text-xl font-semibold leading-snug">{plan?.title}</CardTitle>
              )}
              {plan.subtitle && (
                <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
              )}
            </div>
          </div>


        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {plan.price !== null && (
          <div className="text-3xl font-bold text-primary">
            ${plan.price.toFixed(2)}
            {plan.checkduration && plan.duration && (
              <span className="ml-1 text-base font-normal text-muted-foreground">
                /{plan.duration}
              </span>
            )}
          </div>
        )}

        {plan.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plan.description}
          </p>
        )}

        {plan.features.length > 0 && (
          <div>
            <h4 className="font-medium mb-1">Features:</h4>
            <ul className="text-sm space-y-1 list-inside list-disc pl-2 text-muted-foreground">
              {plan.features.map((feature: any, index: number) => (
                <li key={index}>{feature.title}</li>
              ))}
            </ul>
          </div>
        )}


        {plan.buttontext && (
          <Button className="w-full mt-2">{plan.buttontext}</Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className='p-3'>
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
            <BreadcrumbLink href="/vendor/sitesettings">Site-settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div className="flex justify-between items-center mb-4">
        <div>
          {isCreating ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                <p className="text-muted-foreground">
                  Manage and track your all plans
                </p>
              </div>
            </>
          )}
        </div>
        {isCreating ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button >
            <Link to='/dashboard/createplan'>Create new plan</Link>
          </Button>
        )}
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isCreating
          ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[440px] w-full" />
          ))
          : plans.map((plan) => <PlanCard key={plan._id} plan={plan} />)
        }
      </div>

    </div>
  )
}

