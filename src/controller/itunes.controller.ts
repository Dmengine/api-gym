import { Request, Response } from 'express';
import axios from 'axios';


interface ITunesApp {
  trackName: string;
  userRatingCount?: number;
  privacyPolicyUrl?: string;
  sellerUrl?: string;
  description?: string;
}

interface ITunesResponse {
  resultCount: number;
  results: ITunesApp[];
}


export const getITunesApps = async (req: Request, res: Response) => {
  try {
    const { searchTerm, countryCode } = req.query;

    if (!searchTerm || !countryCode) {
      return res.status(400).json({ error: 'Missing searchTerm or countryCode' });
    }

    const response = await axios.get<ITunesResponse>('https://itunes.apple.com/search', {
      params: {
        term: searchTerm,
        country: countryCode,
        entity: 'software',
        limit: 30
      }
    });

    const apps = response.data.results.map((app: any) => ({
      appName: app.trackName,
      reviews: app.userRatingCount || 0,
      privacyPolicyUrl: app.privacyPolicyUrl || null,
      developerWebsite: app.sellerUrl || null,
      contactEmail: extractEmail(app.description || '') || null
    }));

    return res.status(200).json({
      count: apps.length,
      results: apps,
    });

  } catch (err) {
    console.error('iTunes API Error:', err);
    return res.status(500).json({
      message: 'Error fetching data from iTunes API',
    });
  }
};

const extractEmail = (text: string): string | null => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
};
