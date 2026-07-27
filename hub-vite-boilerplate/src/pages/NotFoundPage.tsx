import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/hooks';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('404.subtitle')}
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('404.back_home')}
        </Button>
      }
    />
  );
};

export default NotFoundPage;
