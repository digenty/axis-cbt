export interface Term {
  termId: number;
  term: string;
  isActiveTerm: boolean;
  startDate: string;
  endDate: string;
}

export interface TermsResponse {
  data: {
    terms: Term[];
    academicSessionName: string;
  };
}
