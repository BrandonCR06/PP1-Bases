
-- 					Modulo Clientes

-- Consulta general - Filtro Nombre
EXEC spFiltroModuloClientes 'Aj'
EXEC spFiltroModuloClientes 'Bha'

-- Consulta especifica - Filtro 
EXEC spSeleccionaClienteId 1
EXEC spSeleccionaClienteId 10


-- 					Modulo Proveedores

-- Consulta general - Filtro Nombre y Categoria

EXEC spFiltroModuloProveedores 'No','Novelty'

-- Consulta especifica 
EXEC spSeleccionarProveedor 4

-- 					Modulo Inventarios

-- Consulta general - Filtro Nombre 

EXEC spProductos 'SHIRT'

-- Consulta especifica 
EXEC spProductoEspecifico 2

-- 					Modulo Ventas

-- Consulta general - Filtro Nombre, Fecha y Monto

EXEC spFiltroFacturas 'Bha','10/10/2013','10/10/2014', 100

-- Consulta especifica 
EXEC spFactura 2

-- Detalles factura
EXEC spDetalleFactura 2


-- 					Modulo Compras

-- Consulta general - Filtro Nombre

EXEC spFiltroOrdenesCompra 'A Datu'

-- Consulta especifica 
EXEC spDetallesOrden 2


-- 					Estadisticas

--Estadistica 1
--Filtro nombre proveedor y categoria proveedor

EXEC spStatsCompra 'A Datu', 'Novelty'

--Estadisca 2
--Filtro nombre cliente y categoria cliente
EXEC spStatsVenta 'Bha', 'Super'

--Estadisca 3
--Filtro por año
EXEC spTop5ProductosGananciaAnno 2014
EXEC spTop5ProductosGananciaAnno 2015

--Estadisca 4
--Filtro por año
EXEC spTOP5ClientesFacturasAnno 2015
EXEC spTOP5ClientesFacturasAnno 2016

--Estadisca 5
--Filtro por año
EXEC spTOP5ProveedoresOrdenesAnno 2013
EXEC spTOP5ProveedoresOrdenesAnno 2014