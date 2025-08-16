import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/button'
import { ChevronDown, ChevronUp, User, Loader2 } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Checkbox } from "../../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
} from "../../components/ui/collapsible"
import axios from 'axios'
import api from '../../API'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

type Permission = {
  _id: string
  permission: string
  description: string
}

type Roles = {
  permissionId: Permission[]
  _id: string
  role: string
  name: string
  permissions: Permission[]
  roleId: string
}

export default function Roles() {
  const [roles, setRoles] = useState<Roles[]>([])

  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([])
  const [expandedRoles, setExpandedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${api}/permission/getpermission?limit=100`)
      setPermissions(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching permissions:', error)
    }
  }
  const fetchRoles = async () => {
    try {
      setLoading(true)
      let response
      response = await axios.get(`${api}/roles/getrole`)
      setRoles(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to fetch roles. Please try again.",
        icon: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
    fetchRoles()
  }, [])

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const updateRolePermissions = async (roleId: string, updatedPermissions: any[]) => {
    try {
      await axios.patch(`${api}/roles/updaterole/${roleId}`, {
        permissionId: updatedPermissions.map(p => String((p as any)?._id || p))
      });
      Swal.fire({
        icon: 'success',
        title: 'Permissions updated',
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Could not update permissions'
      });
    }
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prev =>
      prev.map(role => {
        if (role._id === roleId) {
          const hasIt = role.permissionId.some(p => p._id === permissionId);
          const updatedPermissions = hasIt
            ? role.permissionId.filter(p => p._id !== permissionId)
            : [...role.permissionId, permissions.find(p => p._id === permissionId)!];
          updateRolePermissions(roleId, updatedPermissions);

          return { ...role, permissionId: updatedPermissions };
        }
        return role;
      })
    );
  };


  const toggleAllPermissions = (roleId: string, checked: boolean) => {
    setRoles(prev => {
      return prev.map(role => {
        if (role._id === roleId) {
          const updatedPermissions = checked ? [...permissions] : [];
          updateRolePermissions(roleId, updatedPermissions);
          return { ...role, permissionId: updatedPermissions };
        }
        return role;
      });
    });
  };


  const hasPermission = (role: Roles, permissionId: string) => {
    return role.permissionId.some(
      (p) => String((p as any)?._id || p) === String(permissionId)
    );
  };


  const hasAllPermissions = (role: Roles) => {
    return role.permissionId.length === permissions.length && permissions.length > 0
  }

  const hasSomePermissions = (role: Roles) => {
    return role.permissionId.length > 0 && role.permissionId.length < permissions.length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 />
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage roles and permissions
          </p>
        </div>
        <Button
          // onClick={handleCreateRole} 
          onClick={() => { navigate('/dashboard/roles') }}
          className="w-full sm:w-auto"
        >
          <User />
          See All Roles
        </Button>
      </div>

      {/* Create New Role Card */}

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <Card
            key={role._id}
            className="border rounded-lg shadow-sm overflow-hidden"
          >
            {/* Role Header */}
            <CardHeader className=" px-2 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* <h3 className="font-semibold text-base truncate">{role.role}</h3> */}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs h-7 rounded-xs">
                    {role.role}
                  </Badge>
                  <Badge variant="outline" className="text-xs h-7 rounded-xs">
                    <Badge
                      variant='secondary'
                      className="h-5 w-5 flex items-center justify-center rounded-full"
                    >
                      {role.permissionId.length}
                    </Badge>
                    permissions
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Access All */}
                <Badge variant="outline" className="flex items-center h-7 rounded-xs gap-1">
                  <Checkbox
                    checked={hasAllPermissions(role)}
                    ref={(el) => {
                      if (el && "indeterminate" in el) {
                        (el as HTMLInputElement).indeterminate = hasSomePermissions(role);
                      }
                    }}
                    onCheckedChange={(checked) =>
                      toggleAllPermissions(role._id, checked as boolean)
                    }
                  />
                  <span>Access All</span>
                </Badge>

                {/* Manage Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRoleExpansion(role._id)}
                  className="h-7 px-3 text-xs rounded-xs"
                >
                  {expandedRoles.includes(role._id) ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" /> Hide Permissions
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" /> Manage Permissions
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            {/* Collapsible Permissions */}
            <Collapsible open={expandedRoles.includes(role._id)}>
              <CollapsibleContent>
                <CardContent className="p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {permissions.map((permission) => {
                      const isChecked = hasPermission(role, permission._id);
                      return (
                        <div
                          key={permission._id}
                          className={`p-2 border rounded-sm transition-all cursor-pointer ${isChecked
                            ? "bg-primary/5 border"
                            : "hover:bg-muted/40"
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() =>
                                togglePermission(role._id, permission._id)
                              }
                              className="mt-0.5 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm">
                                {permission.permission}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {permission.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Permission Summary - Mobile Optimized */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {permissions.map(permission => (
              <div key={permission._id} className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">{permission.permission}</h4>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {permission.description}
                </p>
                <Badge variant="outline" className="text-xs rounded-xs">
                  {roles.filter(role => hasPermission(role, permission._id)).length} roles
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}