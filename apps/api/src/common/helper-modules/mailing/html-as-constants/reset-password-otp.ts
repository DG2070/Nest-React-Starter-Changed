export const resetPasswordOTP = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Nest-react-starter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
            text-align: center;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        
        .otp-container {
            background-color: #fdf2f2;
            border: 2px dashed #fecaca;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .otp-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #e74c3c;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        
        .warning {
            background-color: #fef3cd;
            border: 1px solid #fde047;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #92400e;
        }
        
        .security-tips {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        
        .security-tips h3 {
            font-size: 16px;
            color: #0369a1;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .security-tips ul {
            font-size: 14px;
            color: #075985;
            padding-left: 20px;
        }
        
        .security-tips li {
            margin-bottom: 5px;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 25px 40px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .company-name {
            font-weight: 600;
            color: #e74c3c;
        }
        
        .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .contact-info a {
            color: #e74c3c;
            text-decoration: none;
        }
        
        .contact-info a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
            }
            
            .security-tips {
                text-align: center;
            }
            
            .security-tips ul {
                text-align: left;
                display: inline-block;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Secure Account Recovery</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello {{{name}}}!
            </div>
            
            <div class="message">
                We received a request to reset your password. Please use the verification code below to proceed with your password reset. If you didn't request this, you can safely ignore this email.
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Password Reset Code</div>
                <div class="otp-code">{{{otp}}}</div>
            </div>
            
            <div class="warning">
                <strong>⏰ Important:</strong> This code will expire in 3 minutes for your security. Never share this code with anyone, including our support team.
            </div>
            
            <div class="security-tips">
                <h3>🛡️ Security Tips</h3>
                <ul>
                    <li>Create a strong password with at least 8 characters</li>
                    <li>Use a combination of letters, numbers, and special characters</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Consider using a password manager</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from <span class="company-name">Nest-react-starter</span></p>
            <p>If you didn't request this password reset, please secure your account immediately.</p>
            
            <div class="contact-info">
                <p>Need help? Contact us at <a href="mailto:support@nest-react-starter.com">support@nest-react-starter.com</a></p>
                <p>For urgent security concerns, please contact us immediately.</p>
            </div>
        </div>
    </div>
</body>
</html>`;
