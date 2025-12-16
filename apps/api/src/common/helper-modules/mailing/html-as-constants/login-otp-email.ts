export const loginOTPTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Nest-react-starter</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            background-color: #f8f9fa;
            border: 2px dashed #dee2e6;
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
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            font-size: 14px;
            color: #856404;
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
            color: #667eea;
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
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nest-react-starter</h1>
            <p>Secure Login Verification</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello {{{name}}}!
            </div>
            
            <div class="message">
                We received a request to sign in to your account. Please use the verification code below to complete your login.
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">{{{otp}}}</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> This code will expire in 10 minutes. Never share this code with anyone. If you didn't request this code, please ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from <span class="company-name">Nest-react-starter</span></p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>`;
