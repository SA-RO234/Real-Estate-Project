<?php

use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '../../models/UserModel.php';
require_once __DIR__ . '../../models/passwordResetModel.php';
require_once __DIR__ . '../../../config/database.php';

require_once "../../vendor/phpmailer/phpmailer/src/PHPMailer.php";
require_once "../../vendor/phpmailer/phpmailer/src/SMTP.php";
require_once "../../vendor/phpmailer/phpmailer/src/Exception.php";


class ForgotPasswordController
{
    private $userModel;
    private $resetModel;
    private $mail;

    public function __construct()
    {
        $database = new Database();
        $db = $database->getConnection();
        $this->resetModel = new PasswordResetModel();
        $this->userModel = new User($db);
        //  Setup PHPMailer
        $this->mail = new PHPMailer();
        $this->mail->isSMTP();
        $this->mail->Host = 'sandbox.smtp.mailtrap.io';
        $this->mail->SMTPAuth = true;
        $this->mail->Port = 2525;
        $this->mail->Username = '18f4ff3638633f';
        $this->mail->Password = '8ce4534182baf3';
        $this->mail->setFrom('narong@gmail.com', 'Real Estate App'); // Use any valid email
    }
    public function requestReset($email)
    {
        $user = $this->userModel->getUserByEmail($email);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Email not found'
            ];
        }

        $token = bin2hex(random_bytes(32));
        $expires = date("Y-m-d H:i:s", time() + 3600);

        $this->resetModel->createResetToken($user['id'], $token, $expires);

        $resetLink = "https://real-estate-clientside.onrender.com/reset-password?token=$token";

        // Send email
        $this->mail->addAddress($email, $user['name'] ?? '');
        $this->mail->Subject = 'Password Reset Request';
        $this->mail->isHTML(true);
        $htmlContent = "
           <html>
           <body>
               <h2>Password Reset Request</h2>
               <p>Click the following link to reset your password:</p>
               <a href='{$resetLink}'>Reset Password</a>
               <p>If you did not request this, please ignore this email.</p>
           </body>
           </html>
       ";

        $textContent = "Click the following link to reset your password: {$resetLink}\nIf you did not request this, please ignore this email.";

        $this->mail->Body = $htmlContent;
        $this->mail->AltBody = $textContent;

        if (!$this->mail->send()) {
            return [
                'success' => false,
                'message' => 'Failed to send reset email.',
                'error' => $this->mail->ErrorInfo
            ];
        }

        return [
            'success' => true,
            'message' => 'A verification link has been sent to your email.'
        ];
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
