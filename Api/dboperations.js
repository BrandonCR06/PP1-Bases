var config = require('./dbconfig');
const sql = require('mssql');

async function getCustomers() {
    try {
        let pool = await sql.connect(config);
        let clientes = await pool.request()
        .query("SELECT C.CustomerID as id, C.CustomerName as Nombre_Cliente, CC.CustomerCategoryName as Categoria_Cliente, DM.DeliveryMethodName as Metodo_Entrega FROM Sales.Customers C INNER JOIN Sales.CustomerCategories CC on C.CustomerCategoryID = CC.CustomerCategoryID INNER JOIN Application.DeliveryMethods DM on C.DeliveryMethodID = DM.DeliveryMethodID --WHERE C.CustomerName LIKE '%' + @Nombre + '%' ORDER BY C.CustomerName");
        return clientes.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function  getCustomer(customerId) {
    try {
      let  pool = await  sql.connect(config);
      let  cliente = await  pool.request()
      .input('input_parameter', sql.Int, customerId)
      .query("SELECT C.CustomerID as id,  \
                  C.CustomerName as Nombre_Cliente, CC.CustomerCategoryName as Categoria_Cliente, \
                  BG.BuyingGroupName as Grupo_de_compra, \
                  P.FullName as Contacto_Primario, \
                  P2.FullName as Contacto_Secundario, \
                  C2.CustomerName as BillToCustomerID,\
                  DM.DeliveryMethodName as Metodo_Entrega, \
                  Cities.CityName as Ciudad_Entrega,\
                  C.PostalPostalCode as Codigo_Postal, \
                  C.PhoneNumber as Telefono,\
                  C.FaxNumber as Fax, \
                  C.PaymentDays as Dias_gracia,\
                  C.WebsiteURL as Sitio_Web, \
                  C.DeliveryAddressLine1 as Direccion,\
                  C.DeliveryAddressLine2 as Direccion2, \
                  C.DeliveryPostalCode as Direccion_Postal,\
                  C.DeliveryLocation as DeliveryLocation\
            FROM Sales.CustomerCategories CC\
            INNER JOIN Sales.Customers C on C.CustomerCategoryID = CC.CustomerCategoryID\
            INNER JOIN Application.DeliveryMethods DM on C.DeliveryMethodID = DM.DeliveryMethodID\
            LEFT JOIN Sales.BuyingGroups BG on C.BuyingGroupID = BG.BuyingGroupID\
            INNER JOIN Application.Cities Cities ON C.DeliveryCityID = Cities.CityID\
            INNER JOIN Application.People P ON P.PersonID = C.PrimaryContactPersonID \
            LEFT JOIN Application.People P2 ON P2.PersonID = C.AlternateContactPersonID\
            INNER JOIN Sales.Customers C2 ON C2.CustomerID = C.CustomerID \
            WHERE C.CustomerID = @input_parameter	");
      return  cliente.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }


  async function getSuppliers() {
    try {
        let pool = await sql.connect(config);
        let proveedores = await pool.request()
        .query("SELECT S.SupplierId as id, S.SupplierName as Proveedor, SC.SupplierCategoryName as Categoria,   \
               DM.DeliveryMethodName as Metodo_Entrega    FROM Purchasing.Suppliers S \
               INNER JOIN Purchasing.SupplierCategories SC on S.SupplierCategoryID = SC.SupplierCategoryID \
               LEFT JOIN Application.DeliveryMethods DM on S.DeliveryMethodID = DM.DeliveryMethodID");
        return proveedores.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function  getSupplier(supplierId) {
    try {
      let  pool = await  sql.connect(config);
      let  proveedor = await  pool.request()
      .input('input_parameter', sql.Int, supplierId)
      .query("SELECT S.SupplierId as id, S.SupplierReference as Codigo_Proveedor, \
                  S.SupplierName as Proveedor, \
                  SC.SupplierCategoryName as Categoria, \
                  P.FullName as Contacto_Primario, \
                  P.FullName as Contacto_Alternativo, \
                  DM.DeliveryMethodName as Metodo_Entrega, \
                  Cities.CityName as Ciudad_Entrega, \
                  S.DeliveryPostalCode as Postal_Entrega,\
                  S.PhoneNumber as Telefono, \
                  S.FaxNumber as Fax,\
                  S.WebsiteURL as Sitio_Web, \
                  S.DeliveryAddressLine1 as Direccion,\
                  S.DeliveryAddressLine2 as Direccion2, \
                  S.PostalAddressLine1 as Postal_Direccion,\
                  S.PostalAddressLine2 as Postal_Direccion2, \
                  S.DeliveryLocation as DeliveryLocation,\
                  S.BankAccountName as Banco, \
                  S.BankAccountNumber as Numero_Cuenta,\
                  S.PaymentDays as Dias_Gracia\
            FROM Purchasing.Suppliers S\
            INNER JOIN Purchasing.SupplierCategories SC on S.SupplierCategoryID = SC.SupplierCategoryID\
            LEFT JOIN Application.DeliveryMethods DM on S.DeliveryMethodID = DM.DeliveryMethodID\
            INNER JOIN Application.Cities Cities on S.DeliveryCityID = Cities.CityID\
            INNER JOIN Application.People P on S.PrimaryContactPersonID = P.PersonID\
            INNER JOIN Application.People P2 on S.AlternateContactPersonID = P2.PersonID \
                        WHERE S.SupplierId = @input_parameter	");
      return  proveedor.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  
  async function getInventory() {
    try {
        let pool = await sql.connect(config);
        let inventario = await pool.request()
                  .query("Select SI.StockItemId as id, SI.StockItemName as Producto, \
                  SIH.QuantityOnHand as Cantidad_Inventario\
            FROM Warehouse.StockItems SI\
            INNER JOIN Warehouse.StockItemHoldings SIH ON SI.StockItemID = SIH.StockItemID\
            LEFT JOIN Warehouse.Colors Color ON  SI.ColorID = COLOR.ColorID");
        return inventario.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function getProduct(productId) {
    try {
      let  pool = await  sql.connect(config);
      let  product = await  pool.request()
      .input('input_parameter', sql.Int, productId)
      .query("SELECT SI.StockItemId as id, SI.StockItemName as Producto,  \
              SIH.QuantityOnHand as Cantidad,  \
            Color.ColorName as Color,  \
            PT.PackageTypeName as Unidad_empaquetamiento, \
            PT2.PackageTypeName as Empaquetamiento,  \
            SI.QuantityPerOuter, \
            SI.Brand as Marca,  \
            SI.Size as Medida, \
            SI.TaxRate as Impuesto,  \
            SI.UnitPrice as Precio_Unitario, \
            SI.RecommendedRetailPrice as Precio_Venta,  \
            SI.TypicalWeightPerUnit as Peso, \
            SI.SearchDetails as Palabras_clave,  \
            SIH.BinLocation as Ubicacion \
        FROM Warehouse.StockItems SI \
        INNER JOIN Warehouse.StockItemHoldings SIH ON SI.StockItemID = SIH.StockItemID \
        INNER JOIN Warehouse.StockItemStockGroups SSG on SIH.StockItemID = SSG.StockItemID \
        INNER JOIN Warehouse.StockGroups SG ON SSG.StockGroupID = SG.StockGroupID \
        LEFT JOIN Warehouse.Colors Color ON  SI.ColorID = COLOR.ColorID \
        INNER JOIN Warehouse.PackageTypes PT ON SI.UnitPackageID = PT.PackageTypeID \
        INNER JOIN Warehouse.PackageTypes PT2 ON SI.OuterPackageID = PT2.PackageTypeID \
        WHERE SI.StockItemId = @input_parameter \
        GROUP BY SI.StockItemId, SI.StockItemName, SIH.QuantityOnHand, Color.ColorName, PT.PackageTypeName,  \
        PT2.PackageTypeName, SI.QuantityPerOuter, SI.Brand, SI.Size, SI.TaxRate, SI.UnitPrice, \
        SI.RecommendedRetailPrice, SI.TypicalWeightPerUnit, SI.SearchDetails, SIH.BinLocation");
      return  product.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function getInvoices() {
    try {
        let pool = await sql.connect(config);
        let invoices = await pool.request()
                  .query("SELECT I.InvoiceID as id, C.CustomerName as Nombre_Cliente,\
                  I.InvoiceDate as Fecha, \
                  DM.DeliveryMethodName as Metodo_Entrega, \
                  SUM(IL.ExtendedPrice) as Monto\
             FROM Sales.Invoices I\
             INNER JOIN Sales.InvoiceLines IL on I.InvoiceID = IL.InvoiceID\
             INNER JOIN Application.DeliveryMethods DM ON I.DeliveryMethodID = DM.DeliveryMethodID\
             INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID \
             GROUP BY I.InvoiceID, C.CustomerName, I.InvoiceDate, DM.DeliveryMethodName");
        return invoices.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function getInvoice(invoiceId) {
    try {
      let  pool = await  sql.connect(config);
      let  invoice = await  pool.request()
      .input('input_parameter', sql.Int, invoiceId)
      .query("SELECT I.InvoiceID as id, \
                C.CustomerName as Nombre_Cliente, \
                DM.DeliveryMethodName as Metodo_Entrega, \
                I.CustomerPurchaseOrderNumber as Numero_Orden, \
                P.FullName as Contacto,\
                P2.FullName as Nombre_Vendedor,\
                I.InvoiceDate as Fecha, \
                I.DeliveryInstructions as Instrucciones_Entrega\
          FROM Sales.Invoices I\
          INNER JOIN Sales.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID\
          INNER JOIN Application.DeliveryMethods DM ON I.DeliveryMethodID = DM.DeliveryMethodID\
          INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID\
          INNER JOIN Application.People P ON I.ContactPersonID = P.PersonID\
          INNER JOIN Application.People P2 ON I.SalespersonPersonID = P2.PersonID\
          WHERE I.InvoiceID = @input_parameter \
          GROUP BY I.InvoiceID, C.CustomerName, \
                DM.DeliveryMethodName, I.InvoiceDate, \
                I.CustomerPurchaseOrderNumber, P.FullName,\
                P2.FullName, I.InvoiceDate,\
                I.DeliveryInstructions ");
      return  invoice.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function getOrders() {
    try {
        let pool = await sql.connect(config);
        let orders = await pool.request()
                  .query("SELECT O.PurchaseOrderID AS id, \
                  P.FullName AS Contacto, \
                  DM.DeliveryMethodName AS Metodo_Entrega,\
                  O.OrderDate AS Fecha,\
                  S.SupplierName AS Proveedor\
             FROM Purchasing.PurchaseOrders O\
             INNER JOIN Purchasing.PurchaseOrderLines OL ON O.PurchaseOrderID = OL.PurchaseOrderLineID\
             INNER JOIN Application.DeliveryMethods DM ON O.DeliveryMethodID = DM.DeliveryMethodID\
             INNER JOIN Application.People P ON O.ContactPersonID = P.PersonID\
             INNER JOIN Purchasing.Suppliers S ON O.SupplierID = S.SupplierID");
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function getOrder(orderId) {
    try {
      let  pool = await  sql.connect(config);
      let  order = await  pool.request()
      .input('input_parameter', sql.Int, orderId)
      .query("SELECT OL.PurchaseOrderID AS id, SI.StockItemName, OL.OrderedOuters, OL.ExpectedUnitPricePerOuter, PT.PackageTypeName \
              FROM Purchasing.PurchaseOrderLines OL\
              INNER JOIN Warehouse.StockItems SI ON OL.StockItemID = SI.StockItemID\
              INNER JOIN Warehouse.PackageTypes PT ON OL.PackageTypeID = PT.PackageTypeID\
              WHERE OL.PurchaseOrderID = @input_parameter");
      return  order.recordsets;
    }
    catch (error) {
      console.log(error);
    }
  }

 

  async function getStats1() {
    try {
        let pool = await sql.connect(config);
        let stats = await pool.request()
                  .query("SELECT ROW_NUMBER() OVER(PARTITION BY PO.SupplierID ORDER BY PO.SupplierID)as id, \
                  CASE \
                   WHEN (GROUPING(S.SupplierName) = 1) AND  (GROUPING(SC.SupplierCategoryName) = 1) THEN 'Total' \
                   ELSE S.SupplierName \
                  END Proveedor, \
                  CASE \
                     WHEN (GROUPING(SC.SupplierCategoryName) = 1) AND (GROUPING(S.SupplierName) = 1) THEN 'General' \
                   WHEN (GROUPING(SC.SupplierCategoryName) = 1) THEN 'Total Categoria' \
                   ELSE SC.SupplierCategoryName \
                  END Categoria,  MIN(ST.TransactionAmount) as Monto_minimo,MAX(ST.TransactionAmount) as Monto_maximo, \
                  AVG(ST.TransactionAmount) as Monto_promedio \
             FROM Purchasing.PurchaseOrders PO \
             INNER JOIN Purchasing.Suppliers S ON PO.SupplierID = S.SupplierID \
             INNER JOIN Purchasing.SupplierCategories SC ON S.SupplierCategoryID = SC.SupplierCategoryID \
             INNER JOIN Purchasing.SupplierTransactions ST ON PO.PurchaseOrderID = ST.PurchaseOrderID \
             GROUP BY ROLLUP (S.SupplierName, SC.SupplierCategoryName),PO.SupplierID");
        return stats.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getStats2() {
  try {
      let pool = await sql.connect(config);
      let stats = await pool.request()
                .query("SELECT  ROW_NUMBER() OVER (ORDER BY C2.CustomerName,CC.CustomerCategoryName ) as id, \
                CASE \
                 WHEN (GROUPING(C2.CustomerName) = 1) AND  (GROUPING(CC.CustomerCategoryName) = 1) THEN 'Total'\
                 ELSE C2.CustomerName\
                END Proveedor,\
                CASE\
                   WHEN (GROUPING(CC.CustomerCategoryName) = 1) AND (GROUPING(C2.CustomerName) = 1) THEN 'General'\
                 WHEN (GROUPING(CC.CustomerCategoryName) = 1) THEN 'Total Categoria'\
                 ELSE CC.CustomerCategoryName\
                END Categoria,\
                MIN(IL.ExtendedPrice) as Minimo ,MAX(IL.ExtendedPrice) as Maximo ,AVG(IL.ExtendedPrice) as Promedio\
           FROM Sales.Invoices I\
           INNER JOIN Sales.Customers C ON C.BillToCustomerID = I.BillToCustomerID\
           INNER JOIN Sales.CustomerCategories CC ON C.CustomerCategoryID = CC.CustomerCategoryID\
           INNER JOIN SALES.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID \
           INNER JOIN SALES.Customers C2 ON I.BillToCustomerID = C2.CustomerID \
           GROUP BY ROLLUP(C2.CustomerName, CC.CustomerCategoryName)"); 
      return stats.recordsets;
  }
  catch (error) {
      console.log(error);
  }
}


  async function getStats3() {
    try {
        let pool = await sql.connect(config);
        let stats = await pool.request()
                  .query("SELECT ROW_NUMBER() OVER (ORDER BY A.fecha ASC) AS id, A.Item, A.Monto, A.Fecha, Ranking \
                  FROM( \
                  SELECT SI.StockItemName Item, SUM(IL.ExtendedPrice) monto, YEAR(I.InvoiceDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(I.InvoiceDate) ORDER BY SUM(IL.ExtendedPrice) DESC) AS Ranking \
                  FROM Sales.Invoices I \
                  INNER JOIN Sales.InvoiceLines IL ON I.InvoiceID = IL.InvoiceID \
                  INNER JOIN Warehouse.StockItems SI ON IL.StockItemID = SI.StockItemID \
                  GROUP BY YEAR(I.InvoiceDate), SI.StockItemName \
                  )AS A \
                  WHERE Ranking<6");
        return stats.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getStats4() {
  try {
      let pool = await sql.connect(config);
      let stats = await pool.request()
                .query("SELECT ROW_NUMBER() OVER (ORDER BY A.fecha ASC) AS id, A.Cliente, A.Cantidad, A.Fecha, Ranking \
                FROM( \
                SELECT C.CustomerName Cliente, count(C.CustomerName) Cantidad, YEAR(I.InvoiceDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(I.InvoiceDate) ORDER BY COUNT(C.CustomerName) DESC) AS Ranking \
                FROM Sales.Invoices I \
                INNER JOIN Sales.Customers C ON I.CustomerID = C.CustomerID \
                GROUP BY YEAR(I.InvoiceDate), C.CustomerName \
                )AS A \
                WHERE Ranking<6");
      return stats.recordsets;
  }
  catch (error) {
      console.log(error);
  }
}

async function getStats5() {
  try {
      let pool = await sql.connect(config);
      let stats = await pool.request()
                .query("SELECT ROW_NUMBER() OVER (ORDER BY A.fecha DESC) AS id, A.Proveedor, A.Cantidad, A.Fecha, Ranking \
                FROM( \
                SELECT S.SupplierName Proveedor, count(S.SupplierName) Cantidad, YEAR(O.OrderDate) as fecha, DENSE_RANK() OVER (PARTITION BY YEAR(O.OrderDate) ORDER BY COUNT(S.SupplierName) DESC) AS Ranking \
                FROM Purchasing.PurchaseOrders O \
                INNER JOIN Purchasing.Suppliers S ON O.SupplierID = S.SupplierID \
                GROUP BY YEAR(O.OrderDate), S.SupplierName \
                )AS A \
                WHERE Ranking<6");
      return stats.recordsets;
  }
  catch (error) {
      console.log(error);
  }
}




module.exports = {
    getCustomers: getCustomers,
    getCustomer : getCustomer,
    getSuppliers: getSuppliers,
    getSupplier : getSupplier,
    getInventory: getInventory,
    getProduct : getProduct,
    getInvoices: getInvoices,
    getInvoice : getInvoice,
    getOrders : getOrders,
    getOrder : getOrder,
    getStats1 : getStats1,
    getStats2 : getStats2,
    getStats3 : getStats3,
    getStats4 : getStats4,
    getStats5 : getStats5
}