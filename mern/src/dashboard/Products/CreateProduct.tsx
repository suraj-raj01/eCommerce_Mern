import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Skeleton } from "../../components/ui/skeleton"
import { useNavigate } from "react-router-dom"

const CreateProduct = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  useEffect(()=>{
    setLoading(false);
  },[])
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">
                  Manage and track all the products
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button onClick={() => { navigate("/dashboard/products") }}>
            See All Products
          </Button>
        )}
      </div>
      Product Page
    </section>
  )
}

export default CreateProduct