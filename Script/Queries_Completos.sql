-- Consulta generales
USE WideWorldImporters

-- 2.1 Módulo de cliente
-- Datos generales
-- Nombre cliente, categoria y método de entrega

CREATE PROCEDURE spFiltroModuloClientes @Nombre nvarchar(100) 
AS
SELECT C.CustomerName as Nombre_Cliente, 
       CC.CustomerCategoryName as Categoria_Cliente, 
	   DM.DeliveryMethodName as Metodo_Entrega
FROM Sales.Customers C
INNER JOIN Sales.CustomerCategories CC on C.CustomerCategoryID = CC.CustomerCategoryID
INNER JOIN Application.DeliveryMethods DM on C.DeliveryMethodID = DM.DeliveryMethodID
WHERE C.CustomerName LIKE '%' + @Nombre + '%'
ORDER BY C.CustomerName

EXEC spFiltroModuloClientes 'Bha'


-- Datos especificos cliente
-- Nombre, Nombre Categoria, BuyingGroup, Contactos(Primario y Alternativo)
CREATE PROCEDURE spSeleccionaClienteId @ID int
AS
SELECT C.CUSTOMERID,
	   C.CustomerName as Nombre_Cliente, 
	   CC.CustomerCategoryName as Categoria_Cliente, 
       BG.BuyingGroupName as Grupo_de_compra, 
	   P.FullName as Contacto_Primario, 
	   P2.FullName as Contacto_Secundario, 
	   C2.CustomerName as BillToCustomerID,
	   DM.DeliveryMethodName as Metodo_Entrega, 
	   Cities.CityName as Ciudad_Entrega,
	   C.PostalPostalCode as Codigo_Postal, 
	   C.PhoneNumber as Telefono,
	   C.FaxNumber as Fax, 
	   C.PaymentDays as Dias_gracia,
	   C.WebsiteURL as Sitio_Web, 
	   C.DeliveryAddressLine1 as Direccion,
	   C.DeliveryAddressLine2 as Direccion2, 
	   C.DeliveryPostalCode as Direccion_Postal,
	   C.DeliveryLocation as DeliveryLocation
FROM Sales.CustomerCategories CC
INNER JOIN Sales.Customers C on C.CustomerCategoryID = CC.CustomerCategoryID
INNER JOIN Application.DeliveryMethods DM on C.DeliveryMethodID = DM.DeliveryMethodID
LEFT JOIN Sales.BuyingGroups BG on C.BuyingGroupID = BG.BuyingGroupID
INNER JOIN Application.Cities Cities ON C.DeliveryCityID = Cities.CityID
INNER JOIN Application.People P ON P.PersonID = C.PrimaryContactPersonID 
LEFT JOIN Application.People P2 ON P2.PersonID = C.AlternateContactPersonID
INNER JOIN Sales.Customers C2 ON C2.CustomerID = C.CustomerID
WHERE C.CustomerID = @ID	

EXEC spSeleccionaClienteId 10


-- 2.2 Módulo de proveedores
-- Datos generales
-- Nombre, categoria, metodo de entrega
-- Filtro proveedores: Nombre y Categoria
CREATE PROCEDURE spFiltroModuloProveedores @Nombre nvarchar(100), @Categoria nvarchar(50)
AS
SELECT S.SupplierName as Proveedor, 
	   SC.SupplierCategoryName as Categoria, 
	   DM.DeliveryMethodName as Metodo_Entrega
FROM Purchasing.Suppliers S
INNER JOIN Purchasing.SupplierCategories SC on S.SupplierCategoryID = SC.SupplierCategoryID
LEFT JOIN Application.DeliveryMethods DM on S.DeliveryMethodID = DM.DeliveryMethodID
WHERE S.SupplierName LIKE '%' + @Nombre + '%' or SC.SupplierCategoryName = '%' + @Categoria + '%'
ORDER BY S.SupplierName

EXEC spFiltroModuloProveedores 'No','Novelty'


-- Datos especificos proveedores
-- SupplierReference, Nombre, Categoria, Contactos (Primario y alternativo), Metodo entrega, Ciudad entrega
-- Delivery Postal Code, Telefono, Fax, Sitio Web

CREATE PROCEDURE spSeleccionarProveedor @ID int
AS
SELECT S.SupplierReference as Codigo_Proveedor, 
	   S.SupplierName as Proveedor, 
	   SC.SupplierCategoryName as Categoria, 
	   P.FullName as Contacto_Primario, 
	   P.FullName as Contacto_Alternativo, 
	   DM.DeliveryMethodName as Metodo_Entrega, 
	   Cities.CityName as Ciudad_Entrega, 
	   S.DeliveryPostalCode as Postal_Entrega,
	   S.PhoneNumber as Telefono, 
	   S.FaxNumber as Fax,
	   S.WebsiteURL as Sitio_Web, 
	   S.DeliveryAddressLine1 as Direccion,
	   S.DeliveryAddressLine2 as Direccion2, 
	   S.PostalAddressLine1 as Postal_Direccion,
	   S.PostalAddressLine2 as Postal_Direccion2, 
	   S.DeliveryLocation as DeliveryLocation,
	   S.BankAccountName as Banco, 
	   S.BankAccountNumber as Numero_Cuenta,
	   S.PaymentDays as Dias_Gracia
FROM Purchasing.Suppliers S
INNER JOIN Purchasing.SupplierCategories SC on S.SupplierCategoryID = SC.SupplierCategoryID
LEFT JOIN Application.DeliveryMethods DM on S.DeliveryMethodID = DM.DeliveryMethodID
INNER JOIN Application.Cities Cities on S.DeliveryCityID = Cities.CityID
INNER JOIN Application.People P on S.PrimaryContactPersonID = P.PersonID
INNER JOIN Application.People P2 on S.AlternateContactPersonID = P2.PersonID
WHERE S.SupplierID = @ID

EXEC spSeleccionarProveedor 4

-- 2.3 Modulo de inventarios

-- Datos generales
-- Nombre del producto, su cantidad en inventarios (Holdings). 

CREATE PROCEDURE spProductos @Nombre nvarchar(100)
AS
SELECT SI.StockItemName as Producto, 
	   SIH.QuantityOnHand as Cantidad_Inventario
FROM Warehouse.StockItems SI
INNER JOIN Warehouse.StockItemHoldings SIH ON SI.StockItemID = SIH.StockItemID
LEFT JOIN Warehouse.Colors Color ON  SI.ColorID = COLOR.ColorID
WHERE SI.StockItemName LIKE '%' + @Nombre + '%'
ORDER BY SI.StockItemName

EXEC spProductos 'SHIRT'

-- Producto especifico 
CREATE PROCEDURE spProductoEspecifico @ID int
AS

SELECT  SI.StockItemName as Producto, 
	    SIH.QuantityOnHand as Cantidad, 
		Color.ColorName as Color, 
		PT.PackageTypeName as Unidad_empaquetamiento,
		PT2.PackageTypeName as Empaquetamiento, 
		SI.QuantityPerOuter,
		SI.Brand as Marca, 
		SI.Size as Medida,
		SI.TaxRate as Impuesto, 
		SI.UnitPrice as Precio_Unitario,
		SI.RecommendedRetailPrice as Precio_Venta, 
		SI.TypicalWeightPerUnit as Peso,
		SI.SearchDetails as Palabras_clave, 
		SIH.BinLocation as Ubicacion
FROM Warehouse.StockItems SI
INNER JOIN Warehouse.StockItemHoldings SIH ON SI.StockItemID = SIH.StockItemID
INNER JOIN Warehouse.StockItemStockGroups SSG on SIH.StockItemID = SSG.StockItemID
INNER JOIN Warehouse.StockGroups SG ON SSG.StockGroupID = SG.StockGroupID
LEFT JOIN Warehouse.Colors Color ON  SI.ColorID = COLOR.ColorID
INNER JOIN Warehouse.PackageTypes PT ON SI.UnitPackageID = PT.PackageTypeID
INNER JOIN Warehouse.PackageTypes PT2 ON SI.OuterPackageID = PT2.PackageTypeID
WHERE SI.StockItemId = @Id
GROUP BY SI.StockItemName, SIH.QuantityOnHand, Color.ColorName, PT.PackageTypeName, 
PT2.PackageTypeName, SI.QuantityPerOuter, SI.Brand, SI.Size, SI.TaxRate, SI.UnitPrice,
SI.RecommendedRetailPrice, SI.TypicalWeightPerUnit, SI.SearchDetails, SIH.BinLocation

EXEC spProductoEspecifico 2



-- 2.4 Módulo de ventas

-- Datos generales
-- Rango de fechas y Rango de montos

-- Filtro
CREATE PROCEDURE spFiltroFacturas @NombreCliente varchar(100), @Fecha datetime, @Fecha2 datetime
AS
SELECT I.InvoiceID as Numero_Factura, 
	   C.CustomerName as Nombre_Cliente,
	   I.InvoiceDate as Fecha, 
	   DM.DeliveryMethodName as Metodo_Entrega, 
	   SUM(IL.ExtendedPrice) as Monto
FROM Sales.Invoices I
INNER JOIN Sales.InvoiceLines IL on I.InvoiceID = IL.InvoiceID
INNER JOIN Application.DeliveryMethods DM ON I.DeliveryMethodID = DM.DeliveryMethodID
INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID
WHERE I.InvoiceDate between @Fecha and @Fecha2 or C.CustomerName LIKE '%' + @NombreCliente + '%'
GROUP BY I.InvoiceID, I.InvoiceDate, DM.DeliveryMethodName, C.CustomerName
HAVING SUM(IL.ExtendedPrice) <= @Monto
ORDER BY I.InvoiceID

EXEC spFiltroFacturas 'Bha','10/10/2013','10/10/2014', 100

-- Factura especifica
CREATE PROCEDURE spFactura @Id int
AS
SELECT -- Encabezado
	   I.InvoiceID as Numero_Factura, 
	   C.CustomerName as Nombre_Cliente, 
	   DM.DeliveryMethodName as Metodo_Entrega, 
	   I.CustomerPurchaseOrderNumber as Numero_Orden, 
	   P.FullName as Contacto,
	   P2.FullName as Nombre_Vendedor,
	   I.InvoiceDate as Fecha, 
	   I.DeliveryInstructions as Instrucciones_Entrega
	   -- Detalle factura
FROM Sales.Invoices I
INNER JOIN Sales.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID
INNER JOIN Application.DeliveryMethods DM ON I.DeliveryMethodID = DM.DeliveryMethodID
INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID
INNER JOIN Application.People P ON I.ContactPersonID = P.PersonID
INNER JOIN Application.People P2 ON I.SalespersonPersonID = P2.PersonID
WHERE I.InvoiceID = @Id
GROUP BY I.InvoiceID, C.CustomerName, 
	   DM.DeliveryMethodName, I.InvoiceDate, 
	   I.CustomerPurchaseOrderNumber, P.FullName,
	   P2.FullName, I.InvoiceDate,
	   I.DeliveryInstructions
	   
EXEC spFactura 2

-- Detalles Factura
CREATE PROCEDURE spDetalleFactura @Id int
AS
SELECT SI.StockItemName as Producto, 
	   IL.Quantity as Cantidad, 
	   IL.UnitPrice as Precio_Unitario, 
	   IL.TaxRate as Impuesto, 
	   IL.TaxAmount as Monto_Impuesto, 
	   IL.ExtendedPrice as Precio_Extendido
FROM Sales.InvoiceLines IL
INNER JOIN Warehouse.StockItems SI ON IL.StockItemID = SI.StockItemID
WHERE InvoiceID = @Id

EXEC spDetalleFactura 2

-- 2.5 Modulo de ordenes de compra


-- ORDENES DE COMPRA 

CREATE PROCEDURE spFiltroOrdenesCompra @Proveedor nvarchar(100)
AS
SELECT O.PurchaseOrderID AS Numero_Orden,
	   P.FullName AS Contacto,
	   DM.DeliveryMethodName AS Metodo_Entrega,
	   O.OrderDate AS Fecha,
	   S.SupplierName AS Proveedor
FROM Purchasing.PurchaseOrders O
INNER JOIN Purchasing.PurchaseOrderLines OL ON O.PurchaseOrderID = OL.PurchaseOrderLineID
INNER JOIN Application.DeliveryMethods DM ON O.DeliveryMethodID = DM.DeliveryMethodID
INNER JOIN Application.People P ON O.ContactPersonID = P.PersonID
INNER JOIN Purchasing.Suppliers S ON O.SupplierID = S.SupplierID
WHERE S.SupplierName LIKE '%' + @Proveedor + '%' 

EXEC spFiltroOrdenesCompra 'A Datu'


-- Detalle orden compra 

CREATE PROCEDURE spDetallesOrden @Id int
AS

SELECT SI.StockItemName, OL.OrderedOuters, OL.ExpectedUnitPricePerOuter, PT.PackageTypeName
FROM Purchasing.PurchaseOrderLines OL
INNER JOIN Warehouse.StockItems SI ON OL.StockItemID = SI.StockItemID
INNER JOIN Warehouse.PackageTypes PT ON OL.PackageTypeID = PT.PackageTypeID
WHERE OL.PurchaseOrderID = @Id

EXEC spDetallesOrden 2


-- DATOS ESTADISTICOS



-- 1. 
CREATE PROCEDURE spStatsCompra @proveedor nvarchar(100), @categoria nvarchar(50)
AS

SELECT ROW_NUMBER() OVER(PARTITION BY PO.SupplierID ORDER BY PO.SupplierID)as id,
	   CASE
		  WHEN (GROUPING(S.SupplierName) = 1) AND  (GROUPING(SC.SupplierCategoryName) = 1) THEN 'Total'
		  ELSE S.SupplierName
	   END Proveedor,
	   CASE
	      WHEN (GROUPING(SC.SupplierCategoryName) = 1) AND (GROUPING(S.SupplierName) = 1) THEN 'General'
		  WHEN (GROUPING(SC.SupplierCategoryName) = 1) THEN 'Total Categoria'
		  ELSE SC.SupplierCategoryName
	   END Categoria,
	   MIN(ST.TransactionAmount) as Monto_minimo, 
	   MAX(ST.TransactionAmount) as Monto_maximo,
	   AVG(ST.TransactionAmount) as Monto_promedio
FROM Purchasing.PurchaseOrders PO
INNER JOIN Purchasing.Suppliers S ON PO.SupplierID = S.SupplierID
INNER JOIN Purchasing.SupplierCategories SC ON S.SupplierCategoryID = SC.SupplierCategoryID
INNER JOIN Purchasing.SupplierTransactions ST ON PO.PurchaseOrderID = ST.PurchaseOrderID
WHERE S.SupplierName LIKE '%' + @proveedor + '%' or SC.SupplierCategoryName = '%' + @categoria + '%'
GROUP BY ROLLUP (S.SupplierName, SC.SupplierCategoryName),PO.SupplierID

EXEC spStatsCompra 'A Datu', 'Novelty'



-- 2.
CREATE PROCEDURE spStatsVenta @cliente nvarchar(100), @categoria nvarchar(50)
AS
SELECT  ROW_NUMBER() OVER (ORDER BY C2.CustomerName,CC.CustomerCategoryName ) as id,
	   CASE
		  WHEN (GROUPING(C2.CustomerName) = 1) AND  (GROUPING(CC.CustomerCategoryName) = 1) THEN 'Total'
		  ELSE C2.CustomerName
	   END Proveedor,
	   CASE
	      WHEN (GROUPING(CC.CustomerCategoryName) = 1) AND (GROUPING(C2.CustomerName) = 1) THEN 'General'
		  WHEN (GROUPING(CC.CustomerCategoryName) = 1) THEN 'Total Categoria'
		  ELSE CC.CustomerCategoryName
	   END Categoria,
	   MIN(IL.ExtendedPrice) as Minimo ,MAX(IL.ExtendedPrice) as Maximo ,AVG(IL.ExtendedPrice) as Promedio
FROM Sales.Invoices I
INNER JOIN Sales.Customers C ON C.BillToCustomerID = I.BillToCustomerID
INNER JOIN Sales.CustomerCategories CC ON C.CustomerCategoryID = CC.CustomerCategoryID
INNER JOIN SALES.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID
INNER JOIN SALES.Customers C2 ON I.BillToCustomerID = C2.CustomerID
WHERE C2.CustomerName LIKE '%' + @cliente + '%' or CC.CustomerCategoryName = '%' + @categoria + '%'
GROUP BY ROLLUP(C2.CustomerName, CC.CustomerCategoryName)


EXEC spStatsVenta 'Bha', 'Super'




-- 3.

CREATE PROCEDURE spTop5ProductosGananciaAnno @Anno int 
AS

SELECT ROW_NUMBER() OVER (ORDER BY A.fecha ASC) AS id, A.Item, A.Monto, A.Fecha, Ranking
FROM(
SELECT SI.StockItemName Item, SUM(IL.ExtendedPrice) monto, YEAR(I.InvoiceDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(I.InvoiceDate) ORDER BY SUM(IL.ExtendedPrice) DESC) AS Ranking
FROM Sales.Invoices I
INNER JOIN Sales.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID
INNER JOIN Warehouse.StockItems SI ON IL.StockItemID = SI.StockItemID
GROUP BY YEAR(I.InvoiceDate), SI.StockItemName
)AS A
WHERE Ranking<6 AND A.Fecha = @Anno

EXEC spTop5ProductosGananciaAnno 2014

-- 4. 

CREATE PROCEDURE spTOP5ClientesFacturasAnno @Anno int
AS

SELECT ROW_NUMBER() OVER (ORDER BY A.fecha DESC) AS RowsNumber, A.Cliente, A.Cantidad, A.Fecha, Ranking
FROM(
SELECT C.CustomerName Cliente, count(C.CustomerName) Cantidad, YEAR(I.InvoiceDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(I.InvoiceDate) ORDER BY COUNT(C.CustomerName) DESC) AS Ranking
FROM Sales.Invoices I
INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID
GROUP BY YEAR(I.InvoiceDate), C.CustomerName
)AS A
WHERE Ranking<6 and A.Fecha = @Anno

EXEC spTOP5ClientesFacturasAnno 2015

-- 5.

CREATE PROCEDURE spTOP5ProveedoresOrdenesAnno @Anno int
AS
SELECT ROW_NUMBER() OVER (ORDER BY A.fecha DESC) AS RowsNumber, A.Proveedor, A.Cantidad, A.Fecha, Ranking
FROM(
SELECT S.SupplierName Proveedor, count(S.SupplierName) Cantidad, YEAR(O.OrderDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(O.OrderDate) ORDER BY COUNT(S.SupplierName) DESC) AS Ranking
FROM Purchasing.PurchaseOrders O
INNER JOIN Purchasing.Suppliers S ON O.SupplierID = S.SupplierID
GROUP BY YEAR(O.OrderDate), S.SupplierName
)AS A
WHERE Ranking<6  AND A.Fecha = @Anno

EXEC spTOP5ProveedoresOrdenesAnno 2014
