import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, LogOut, BarChart3, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin using useEffect
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  const { data: confirmations, isLoading: confirmationsLoading, error: confirmationsError } = trpc.confirmations.list.useQuery();
  const { data: stats, isLoading: statsLoading, error: statsError } = trpc.confirmations.stats.useQuery();

  const handleLogout = async () => {
    await logout();
    toast.success("Desconectado com sucesso!");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      yes: { label: "Confirmado", variant: "default" as const, color: "bg-green-100 text-green-800" },
      no: { label: "Recusado", variant: "secondary" as const, color: "bg-red-100 text-red-800" },
      maybe: { label: "Talvez", variant: "outline" as const, color: "bg-yellow-100 text-yellow-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const isLoading = confirmationsLoading || statsLoading;

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 text-sm mt-1">Chá de Fralda - Confirmações de Presença</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Confirmações</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Confirmados</p>
                    <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                  </div>
                  <div className="text-2xl">✨</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Talvez</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.maybe}</p>
                  </div>
                  <div className="text-2xl">🤔</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recusados</p>
                    <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
                  </div>
                  <div className="text-2xl">😢</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Acompanhantes</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalCompanions}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confirmations Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-t-2xl">
            <CardTitle className="text-2xl text-gray-800">Lista de Confirmações</CardTitle>
            <CardDescription className="text-gray-600">
              Todas as confirmações de presença recebidas
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
              </div>
            ) : confirmationsError ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">Erro ao carregar confirmações</p>
              </div>
            ) : confirmations && confirmations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-gray-200 hover:bg-transparent">
                      <TableHead className="font-bold text-gray-700">Nome</TableHead>
                      <TableHead className="font-bold text-gray-700">Acompanhantes</TableHead>
                      <TableHead className="font-bold text-gray-700">Status</TableHead>
                      <TableHead className="font-bold text-gray-700">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {confirmations.map((confirmation) => (
                      <TableRow key={confirmation.id} className="border-b border-gray-100 hover:bg-pink-50">
                        <TableCell className="font-medium text-gray-800">{confirmation.fullName}</TableCell>
                        <TableCell className="text-gray-600">{confirmation.numberOfCompanions}</TableCell>
                        <TableCell>{getStatusBadge(confirmation.confirmationStatus)}</TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {new Date(confirmation.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma confirmação recebida ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
