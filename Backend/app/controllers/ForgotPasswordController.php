<?php
require_once __DIR__ . '../../models/UserModel.php';
require_once __DIR__ . '../../models/passwordResetModel.php';
require_once __DIR__ . '../../../config/database.php';

class ForgotPasswordController{
    private $userModel;
    private $resetModel;

    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->resetModel = new PasswordResetModel($db);
        $this->userModel = new User($db);
    }
    public function requestReset($email)
    {
        $user = $this->userModel->getUserByEmail($email);
        if (!$user) return ['message' => 'Email not found'];

        $token = bin2hex(random_bytes(32));
        $expires = date("Y-m-d H:i:s", time() + 3600);

        $this->resetModel->createResetToken($user['id'], $token, $expires);

        $resetLink = getenv('FRONTEND_URL') . "/reset-password?token=$token";
        // You can use PHPMailer here instead of mail() for production
        mail($email, "Reset Password", "Reset link: $resetLink");

        return ['message' => 'Reset email sent'];
    }

    public function resetPassword($token, $newPassword)
    {

        $reset = $this->resetModel->getResetByToken($token);
        if (!$reset) return ['message' => 'Invalid or expired token'];

        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $this->userModel->updatePasswordById($reset['user_id'], $hashedPassword);
        $this->resetModel->deleteResetToken($token);
        return ['message' => 'Password reset successful'];
    }
}
