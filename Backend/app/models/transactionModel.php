<?php
class TransactionModel
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // Create a new transaction
    public function create($data)
    {
        $stmt = $this->db->prepare(
            "INSERT INTO transactions (listing_id, transaction_date, sale_price, commission_rate, total_commission)
             VALUES (?, ?, ?, ?, ?)"
        );
        return $stmt->execute([
            $data['listing_id'],
            $data['transaction_date'],
            $data['sale_price'],
            $data['commission_rate'],
            $data['total_commission']
        ]);
    }

    // Get transaction by ID
    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get all transactions
    public function getAll()
    {
        $stmt = $this->db->query("SELECT * FROM transactions ORDER BY transaction_date DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Update a transaction
    public function update($id, $data)
    {
        $stmt = $this->db->prepare(
            "UPDATE transactions SET listing_id = ?, transaction_date = ?, sale_price = ?, commission_rate = ?, total_commission = ?
             WHERE id = ?"
        );
        return $stmt->execute([
            $data['listing_id'],
            $data['transaction_date'],
            $data['sale_price'],
            $data['commission_rate'],
            $data['total_commission'],
            $id
        ]);
    }

    // Delete a transaction
    public function delete($id){
        $stmt = $this->db->prepare("DELETE FROM transactions WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // Get dashboard statist
    public function getDashboardStats()
    {
        // Total Revenue
        $stmt = $this->db->query("SELECT COALESCE(SUM(sale_price), 0) AS total_revenue FROM transactions");
        $totalRevenue = $stmt->fetch(PDO::FETCH_ASSOC)['total_revenue'];
    
        // New Customers (users registered in the last 30 days)
        $stmt = $this->db->query("SELECT COUNT(*) AS new_customers FROM users WHERE created_at >= NOW() - INTERVAL '30 days'");
        $newCustomers = $stmt->fetch(PDO::FETCH_ASSOC)['new_customers'];
    
        // Active Accounts (fallback: total users)
        $stmt = $this->db->query("SELECT COUNT(*) AS active_accounts FROM users");
        $activeAccounts = $stmt->fetch(PDO::FETCH_ASSOC)['active_accounts'];
    
        // Growth Rate (percentage increase in transactions over last period)
        $stmt = $this->db->query("
            SELECT 
                (CASE WHEN prev.count = 0 THEN 0 
                      ELSE ROUND(100.0 * (curr.count - prev.count) / prev.count, 2) END) AS growth_rate
            FROM
                (SELECT COUNT(*) AS count FROM transactions WHERE transaction_date >= NOW() - INTERVAL '30 days') curr,
                (SELECT COUNT(*) AS count FROM transactions WHERE transaction_date < NOW() - INTERVAL '30 days' AND transaction_date >= NOW() - INTERVAL '60 days') prev
        ");
        $growthRate = $stmt->fetch(PDO::FETCH_ASSOC)['growth_rate'];
    
        return [
            'total_revenue'   => $totalRevenue,
            'new_customers'   => $newCustomers,
            'active_accounts' => $activeAccounts,
            'growth_rate'     => $growthRate
        ];
    }
}