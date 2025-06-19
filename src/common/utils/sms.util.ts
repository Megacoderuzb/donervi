import axios, { AxiosResponse } from 'axios';
/**
 * Sends an SMS with a verification code
 * @param phone - The phone number to send SMS to
 * @param code - The verification code
 * @param configService - Instance of ConfigService for accessing environment variables
 * @returns Promise<boolean>
 */
export async function sendSMS(phone: string, code: number) {
  try {
    // Validate inputs
    if (!phone || !code) {
      throw new Error('Phone number and code are required');
    }

    const smsLogin = process.env.SMS_LOGIN;
    const smsPassword = process.env.SMS_PASSWORD;

    if (!smsLogin || !smsPassword) {
      throw new Error('SMS credentials are not configured');
    }

    // Prepare SMS data
    const smsData = [
      {
        phone,
        text: `Kingsman: Ro'yxatdan o'tish kodingiz - ${code}\n\nUshbu kod 2 daqiqa davomida amal qiladi. Xavfsizlik maqsadida kodni boshqalarga oshkor qilmang.`,
      },
    ];

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append('login', smsLogin);
    formData.append('password', smsPassword);
    formData.append('data', JSON.stringify(smsData));

    // Send SMS
    const smsResponse: AxiosResponse = await axios.post(
      'http://185.8.212.184/smsgateway/',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (smsResponse.status !== 200) {
      throw new Error(
        `SMS gateway responded with status: ${smsResponse.status}`,
      );
    }

    // Update SMS counter
    try {
      await axios.put(
        'https://bot.hypernova.uz/api/sms/plus/9985936a-9a88-46dd-8b05-ce4fe7ea3602',
      );
    } catch (counterError) {
      console.warn(
        'Failed to update SMS counter:',
        counterError.response?.status || counterError.message,
      );
    }

    return true;
  } catch (error) {
    console.error('SMS sending failed:', error.message);
    throw error;
  }
}
